import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { toEmail } = await req.json();
    if (!toEmail) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const logoUrl = "https://pathwayet.com/logo.png";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Pathway Agency Job Alerts</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%);padding:32px;text-align:center;">
              <img src="${logoUrl}" alt="Pathway Agency Logo" width="120" style="display:block;margin:0 auto 16px;border-radius:12px;" />
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Pathway Agency Ethiopia</h1>
              <p style="color:#bfdbfe;margin:6px 0 0;font-size:13px;">Your Career Gateway to the World</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="color:#1e293b;font-size:22px;font-weight:800;margin:0 0 16px;">🔔 You're now subscribed to Job Alerts!</h2>
              <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Thank you for subscribing to <strong>Pathway Agency Ethiopia</strong> job alerts. You will be the first to know whenever we post new opportunities in sectors like Embassy, NGO, Aviation, and International Jobs.
              </p>

              <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;margin-bottom:24px;border-radius:0 8px 8px 0;">
                <p style="color:#1e3a8a;font-size:14px;margin:0;line-height:1.6;font-weight:600;">
                  <strong>What you'll receive:</strong><br/>
                  ✅ Latest job postings<br/>
                  ✅ Exclusive opportunity notifications<br/>
                  ✅ Important deadline reminders
                </p>
              </div>

              <hr style="border:none;border-top:2px dashed #e2e8f0;margin:28px 0;" />

              <p style="color:#1e3a8a;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 8px;">አማርኛ</p>
              <p style="color:#475569;font-size:15px;line-height:1.8;margin:0 0 20px;">
                የ<strong>Pathway Agency Ethiopia</strong> የሥራ ማስጠንቀቂያ ደንበኝነት ለመመዝገብዎ እናመሰግናለን! አዳዲስ የሥራ ዕድሎችን ከሁሉም ቀደም ብለው ያውቃሉ።
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">Pathway Agency Ethiopia</p>
              <p style="color:#94a3b8;font-size:12px;margin:0;">Reply directly to this email if you have any questions.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const { error } = await resend.emails.send({
      from: "Pathway Agency <notifications@pathwayet.com>",
      to: toEmail,
      replyTo: "pathwayagency15@gmail.com",
      subject: "🔔 You're subscribed to Pathway Agency Job Alerts!",
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
