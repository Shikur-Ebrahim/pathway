import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { toEmail, toName, score, total, passed } = await req.json();
    if (!toEmail || !toName || score === undefined || !total || passed === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const color = passed ? "#22c55e" : "#ef4444";
    const bg = passed ? "#f0fdf4" : "#fef2f2";
    const border = passed ? "#bbf7d0" : "#fecaca";
    const emoji = passed ? "🎉" : "📝";
    const message = passed 
      ? "Congratulations! You have passed the online interview test. Our recruitment team will review your profile and contact you soon with the next steps."
      : "Thank you for completing the online interview test. Unfortunately, you did not reach the passing score this time. We encourage you to continue developing your skills and apply again in the future.";

    const { data, error } = await resend.emails.send({
      from: "Pathway Agency Ethiopia <noreply@pathwayagencyethiopia.com>",
      to: toEmail,
      subject: `Your Interview Results: ${passed ? 'PASSED 🎉' : 'Completed'} — Pathway Agency Ethiopia`,
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
          <div style="font-size:40px;margin-bottom:8px;">${emoji}</div>
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;">Interview Results</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Pathway Agency Ethiopia</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="margin:0 0 20px;color:#374151;font-size:15px;">Dear <strong>${toName}</strong>,</p>
          <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
            Your results for the Online Interview Test are ready.
          </p>

          <!-- Result Box -->
          <div style="background:${bg};border:1px solid ${border};border-radius:16px;padding:24px;margin-bottom:28px;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Your Score</p>
            <p style="margin:0 0 16px;font-size:36px;font-weight:900;color:${color};">${score} <span style="font-size:20px;color:#9ca3af;">/ ${total}</span></p>
            <div style="width:40px;height:2px;background:${border};margin:0 auto 16px;"></div>
            <p style="margin:0;font-size:20px;font-weight:900;color:${color};letter-spacing:1px;">
              ${passed ? 'PASSED' : 'DID NOT PASS'}
            </p>
          </div>

          <p style="margin:0 0 24px;color:#374151;font-size:14px;line-height:1.7;padding:16px;background:#f8fafc;border-radius:12px;">
            ${message}
          </p>
          <p style="margin:0;color:#6b7280;font-size:13px;text-align:center;">Thank you for your time.</p>
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