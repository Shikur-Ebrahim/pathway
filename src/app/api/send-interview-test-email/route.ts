import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { toEmail, toName, scheduledAt } = await req.json();
    if (!toEmail || !toName || !scheduledAt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const dt = new Date(scheduledAt);
    const dateStr = dt.toLocaleDateString("en-ET", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const timeStr = dt.toLocaleTimeString("en-ET", { hour: "2-digit", minute: "2-digit" });

    const { data, error } = await resend.emails.send({
      from: "Pathway Agency Ethiopia <noreply@pathwayagencyethiopia.com>",
      to: toEmail,
      subject: "📋 Your Online Interview Test is Scheduled — Pathway Agency Ethiopia",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#3b82f6,#6366f1);padding:36px 32px;text-align:center;">
          <div style="font-size:40px;margin-bottom:8px;">📋</div>
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">Online Interview Scheduled</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Pathway Agency Ethiopia</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="margin:0 0 20px;color:#374151;font-size:15px;">Dear <strong>${toName}</strong>,</p>
          <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
            You have been invited to take an <strong>Online Interview Test</strong> at Pathway Agency Ethiopia. Please review the schedule details below.
          </p>

          <!-- Schedule Box -->
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;padding:24px;margin-bottom:28px;text-align:center;">
            <div style="font-size:32px;margin-bottom:12px;">📅</div>
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Interview Date</p>
            <p style="margin:0 0 16px;font-size:20px;font-weight:800;color:#1d4ed8;">${dateStr}</p>
            <div style="width:40px;height:2px;background:#bfdbfe;margin:0 auto 16px;"></div>
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Interview Time</p>
            <p style="margin:0;font-size:24px;font-weight:800;color:#1d4ed8;">${timeStr}</p>
          </div>

          <!-- How To -->
          <div style="background:#f9fafb;border-radius:16px;padding:20px;margin-bottom:24px;">
            <p style="margin:0 0 12px;font-size:14px;font-weight:800;color:#111827;">📱 How to Take Your Test:</p>
            <ol style="margin:0;padding-left:20px;color:#374151;font-size:14px;line-height:2;">
              <li>Visit <a href="https://pathwayet.com" style="color:#3b82f6;font-weight:700;">pathwayet.com</a></li>
              <li>Click the <strong>"🎯 Online Interview"</strong> button</li>
              <li>Enter your email address</li>
              <li>Wait for the countdown timer — questions appear automatically!</li>
            </ol>
          </div>

          <!-- Tips -->
          <div style="background:#fefce8;border:1px solid #fef08a;border-radius:16px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0 0 8px;font-size:13px;font-weight:800;color:#854d0e;">⚡ Quick Tips:</p>
            <ul style="margin:0;padding-left:18px;color:#713f12;font-size:13px;line-height:1.8;">
              <li>10 multiple-choice questions</li>
              <li>60 seconds per question — answer quickly!</li>
              <li>Use a stable internet connection</li>
              <li>Be ready before the start time</li>
            </ul>
          </div>

          <p style="margin:0;color:#6b7280;font-size:13px;text-align:center;">Good luck! We believe in you.</p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6;">
          <p style="margin:0;color:#9ca3af;font-size:12px;font-weight:600;">Pathway Agency Ethiopia</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>\`
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}