import { readDb, writeDb, issueCertificateRecord, appendAuditLog } from "@/lib/db";
import type { BackgroundJob, PortalRole, VerifiedCertificate } from "@/lib/types";

/**
 * Lightweight persistent background job queue stored in `db.jobs`.
 * Offloads slow transactional emails (`axon@askme.pk`) and bulk CSV certificate imports
 * so HTTP request handlers return immediately without blocking user navigation.
 */
function createJobRecord(
  type: BackgroundJob["type"],
  summary: string,
  totalCount?: number
): BackgroundJob {
  const db = readDb();
  const job: BackgroundJob = {
    id: `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    status: "queued",
    summary,
    processedCount: 0,
    totalCount,
    createdAt: new Date().toISOString(),
  };
  if (!Array.isArray(db.jobs)) {
    db.jobs = [];
  }
  db.jobs.unshift(job);
  if (db.jobs.length > 60) {
    db.jobs = db.jobs.slice(0, 60);
  }
  writeDb(db);
  return job;
}

function updateJobStatus(
  id: string,
  patch: Partial<BackgroundJob>
): BackgroundJob | null {
  const db = readDb();
  if (!Array.isArray(db.jobs)) return null;
  const idx = db.jobs.findIndex((j) => j.id === id);
  if (idx < 0) return null;
  db.jobs[idx] = { ...db.jobs[idx], ...patch };
  writeDb(db);
  return db.jobs[idx];
}

export function listBackgroundJobs(limit = 20): BackgroundJob[] {
  const db = readDb();
  return (db.jobs || []).slice(0, limit);
}

/**
 * Offloads a transactional email dispatch onto an async microtask / macrotask worker.
 */
export function enqueueEmailDispatchJob<T>(
  summary: string,
  task: () => Promise<T>
): BackgroundJob {
  const job = createJobRecord("EMAIL_DISPATCH", summary, 1);

  setTimeout(() => {
    updateJobStatus(job.id, { status: "processing" });
    task()
      .then(() => {
        updateJobStatus(job.id, {
          status: "completed",
          processedCount: 1,
          completedAt: new Date().toISOString(),
        });
      })
      .catch((err) => {
        updateJobStatus(job.id, {
          status: "failed",
          error: err instanceof Error ? err.message : "Email dispatch failed",
          completedAt: new Date().toISOString(),
        });
      });
  }, 15);

  return job;
}

export interface CsvCertificateRowInput {
  recipientName: string;
  eventOrRole: string;
  issueDate?: string;
  certCode?: string;
  memberId?: string;
  type?: VerifiedCertificate["type"];
}

/**
 * Processes bulk CSV certificate imports asynchronously in chunked batches
 * so large rosters never stall the API response or starve the Node event loop.
 */
export function enqueueBulkCertificateImportJob(
  rows: CsvCertificateRowInput[],
  actorName: string,
  actorRole: PortalRole
): { job: BackgroundJob; previewCount: number } {
  const job = createJobRecord(
    "BULK_CSV_IMPORT",
    `Bulk certificate CSV import (${rows.length} rows) queued by ${actorName}`,
    rows.length
  );

  const CHUNK_SIZE = 25;

  const processChunks = async () => {
    updateJobStatus(job.id, { status: "processing", processedCount: 0 });
    let processed = 0;

    try {
      for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
        const chunk = rows.slice(i, i + CHUNK_SIZE);
        for (const row of chunk) {
          issueCertificateRecord({
            recipientName: row.recipientName,
            eventOrRole: row.eventOrRole,
            issueDate: row.issueDate,
            certCode: row.certCode,
            memberId: row.memberId,
            type: row.type || "Event Attendance",
            issuerAuthority: "AXON Technical Directorate & Executive Council",
          });
          processed += 1;
        }
        updateJobStatus(job.id, { processedCount: processed });
        // Yield cleanly to event loop between batches
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      appendAuditLog(
        actorName,
        actorRole,
        "BULK_CERTIFICATE_CSV_UPLOAD",
        `Uploaded ${processed} verified certificate records (Job ${job.id})`
      );

      updateJobStatus(job.id, {
        status: "completed",
        processedCount: processed,
        completedAt: new Date().toISOString(),
      });
    } catch (err) {
      updateJobStatus(job.id, {
        status: "failed",
        processedCount: processed,
        error: err instanceof Error ? err.message : "CSV job error",
        completedAt: new Date().toISOString(),
      });
    }
  };

  setTimeout(() => {
    void processChunks();
  }, 10);

  return { job, previewCount: rows.length };
}
