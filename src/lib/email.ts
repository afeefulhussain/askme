import { Resend } from "resend";

const DEFAULT_FROM = process.env.AXON_FROM_EMAIL || "AXON <axon@askme.pk>";

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export interface EmailSendResult {
  sent: boolean;
  provider: "resend" | "dev-log";
  id?: string;
}

async function dispatchEmail(params: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<EmailSendResult> {
  const client = getResendClient();
  if (!client) {
    return { sent: false, provider: "dev-log" };
  }

  try {
    const { data, error } = await client.emails.send({
      from: DEFAULT_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    if (error) {
      console.error("[AXON EMAIL ERROR]", error);
      return { sent: false, provider: "resend" };
    }
    return { sent: true, provider: "resend", id: data?.id };
  } catch (err) {
    console.error("[AXON EMAIL EXCEPTION]", err);
    return { sent: false, provider: "resend" };
  }
}

export async function sendOtpEmail(
  email: string,
  code: string
): Promise<EmailSendResult> {
  return dispatchEmail({
    to: email,
    subject: `${code} is your AXON Portal sign-in code`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#0A0D14;color:#F8FAFC;padding:32px;border:1px solid #1E2738;">
        <div style="font-family:monospace;color:#00F0FF;font-size:12px;letter-spacing:2px;">AXON // TOGETHER WE TRANSMIT</div>
        <h2 style="font-family:'Times New Roman',Georgia,serif;color:#FFFFFF;margin:16px 0 8px;">One-Time Portal Verification Code</h2>
        <p style="color:#94A3B8;font-size:14px;">Enter the 6-digit verification code below to access your AXON portal session at <strong>askme.pk</strong>. This code expires in 10 minutes.</p>
        <div style="margin:24px 0;padding:16px 24px;background:#0D121D;border:1px solid #00F0FF;display:inline-block;font-family:monospace;font-size:28px;font-weight:bold;letter-spacing:6px;color:#00F0FF;">
          ${code}
        </div>
        <p style="color:#64748B;font-size:12px;margin-top:24px;">Originating at IMAC, UET Lahore • Official Secretariat: axon@askme.pk</p>
      </div>
    `,
  });
}

export async function sendOnboardingWelcomeEmail(params: {
  email: string;
  name: string;
  memberId: string;
  wingName: string;
  username: string;
}): Promise<EmailSendResult> {
  return dispatchEmail({
    to: params.email,
    subject: `Welcome to AXON — Member ID ${params.memberId} Activated`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#0A0D14;color:#F8FAFC;padding:32px;border:1px solid #1E2738;">
        <div style="font-family:monospace;color:#10B981;font-size:12px;letter-spacing:2px;">INDUCTION APPROVED // ${params.memberId}</div>
        <h2 style="font-family:'Times New Roman',Georgia,serif;color:#FFFFFF;">Welcome to AXON, ${params.name}</h2>
        <p style="color:#CBD5E1;font-size:14px;">Your induction into the <strong>${params.wingName}</strong> Directorate has been approved by the Executive Council.</p>
        <ul style="color:#94A3B8;font-size:13px;line-height:1.8;">
          <li><strong>Member ID:</strong> ${params.memberId}</li>
          <li><strong>Public Portfolio:</strong> <a href="https://askme.pk/u/${params.username}" style="color:#00F0FF;">https://askme.pk/u/${params.username}</a></li>
          <li><strong>Digital ID & Dashboard:</strong> <a href="https://askme.pk/dashboard" style="color:#00F0FF;">https://askme.pk/dashboard</a></li>
          <li><strong>Credential Verification:</strong> <a href="https://askme.pk/verify?code=${params.memberId}" style="color:#00F0FF;">https://askme.pk/verify?code=${params.memberId}</a></li>
        </ul>
        <p style="color:#64748B;font-size:12px;margin-top:20px;">Together We Transmit — AXON Secretariat (axon@askme.pk)</p>
      </div>
    `,
  });
}

export async function sendContactRoutingEmail(params: {
  name: string;
  organization: string;
  email: string;
  subject: string;
  message: string;
}): Promise<EmailSendResult> {
  return dispatchEmail({
    to: "axon@askme.pk",
    subject: `[AXON Inquiry] ${params.subject} — ${params.name}`,
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#0A0D14;color:#F8FAFC;padding:24px;border:1px solid #1E2738;">
        <h3 style="color:#00F0FF;margin-top:0;">New Institutional Inquiry (${params.subject})</h3>
        <p><strong>Sender:</strong> ${params.name} (${params.email})</p>
        <p><strong>Organization:</strong> ${params.organization}</p>
        <div style="padding:16px;background:#0D121D;border:1px solid #1E2738;color:#E2E8F0;white-space:pre-wrap;">${params.message}</div>
      </div>
    `,
  });
}
