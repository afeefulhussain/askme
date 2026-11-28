import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { canAccessDashboard, getServerSession } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const ALLOWED_BUCKETS = new Set(["avatars", "project-covers", "resumes"]);
const IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
]);
const RESUME_TYPES = new Set(["application/pdf"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function getSafeExtension(mimeType: string, originalName: string): string {
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/jpeg") return ".jpg";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/svg+xml") return ".svg";
  if (mimeType === "application/pdf") return ".pdf";
  const ext = path.extname(originalName).toLowerCase();
  return [".png", ".jpg", ".jpeg", ".webp", ".svg", ".pdf"].includes(ext)
    ? ext
    : ".bin";
}

export async function POST(req: NextRequest) {
  const session = getServerSession();
  if (!session || !canAccessDashboard(session.rbacRole)) {
    return NextResponse.json(
      {
        error:
          "Access Denied: Only approved AXON members may upload media or resumes.",
      },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const bucket = String(formData.get("bucket") || "avatars");
    const file = formData.get("file");

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json(
        { error: "Unsupported storage bucket." },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File payload is required." },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File size must be between 1 byte and 5 MB." },
        { status: 400 }
      );
    }

    const validMime =
      bucket === "resumes"
        ? RESUME_TYPES.has(file.type)
        : IMAGE_TYPES.has(file.type);
    if (!validMime) {
      return NextResponse.json(
        {
          error:
            bucket === "resumes"
              ? "Resumes must be PDF files."
              : "Images must be PNG, JPEG, WebP, or SVG.",
        },
        { status: 400 }
      );
    }

    const ext = getSafeExtension(file.type, file.name);
    const filename = `${session.username}-${Date.now()}${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    const sb = getSupabaseAdmin();
    if (sb) {
      const storagePath = `${session.username}/${filename}`;
      const { error } = await sb.storage
        .from(bucket)
        .upload(storagePath, bytes, {
          contentType: file.type,
          upsert: true,
        });

      if (!error) {
        const { data } = sb.storage.from(bucket).getPublicUrl(storagePath);
        return NextResponse.json(
          { url: data.publicUrl, bucket, storage: "supabase" },
          { status: 201 }
        );
      }
    }

    const targetDir = path.join(process.cwd(), "public", "uploads", bucket);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = path.join(targetDir, filename);
    fs.writeFileSync(targetFile, bytes);

    return NextResponse.json(
      { url: `/uploads/${bucket}/${filename}`, bucket, storage: "local" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to process file upload." },
      { status: 400 }
    );
  }
}
