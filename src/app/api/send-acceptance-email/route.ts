import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { toEmail, toName, sector, role } = await req.json();

    if (!toEmail || !toName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const logoUrl = "https://pathwayet.com/logo.png";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Application Accepted - Pathway Agency</title>
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

              <!-- English Section -->
              <h2 style="color:#1e293b;font-size:20px;font-weight:800;margin:0 0 12px;">🎉 Congratulations, Application Accepted!</h2>
              <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 20px;">
                Dear <strong>${toName}</strong>,<br/><br/>
                We are thrilled to let you know that your initial application for the role of <strong>${role}</strong> in the <strong>${sector}</strong> sector at <strong>Pathway Agency Ethiopia</strong> has been <strong>successfully accepted</strong>!
              </p>
              
              <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;margin-bottom:24px;border-radius:0 8px 8px 0;">
                <p style="color:#1e3a8a;font-size:14px;margin:0;line-height:1.6;font-weight:600;">
                  <strong>What's Next?</strong><br/>
                  Our team is currently reviewing the schedule. We will contact you very soon with the exact date and time for your interview appointment. Stay tuned!
                </p>
              </div>

              <!-- Divider -->
              <hr style="border:none;border-top:2px dashed #e2e8f0;margin:28px 0;" />

              <!-- Amharic Section -->
              <h2 style="color:#1e293b;font-size:20px;font-weight:800;margin:0 0 12px;">🎉 እንኳን ደስ አለዎ፣ ማመልከቻዎ ተቀባይነት አግኝቷል!</h2>
              <p style="color:#475569;font-size:15px;line-height:1.8;margin:0 0 20px;">
                ውድ <strong>${toName}</strong>,<br/><br/>
                በ<strong>Pathway Agency Ethiopia</strong> ለ <strong>${sector}</strong> ዘርፍ፣ እንደ <strong>${role}</strong> ያቀረቡት ማመልከቻ <strong>ተቀባይነት ማግኘቱን</strong> በደስታ እንገልጻለን!
              </p>

              <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px 20px;margin-bottom:24px;border-radius:0 8px 8px 0;">
                <p style="color:#166534;font-size:14px;margin:0;line-height:1.8;font-weight:600;">
                  <strong>ቀጣዩ ሂደት ምንድን ነው?</strong><br/>
                  ቡድናችን በአሁኑ ጊዜ ፕሮግራሙን እያዘጋጀ ነው። በቅርቡ ትክክለኛውን የቃለ-መጠይቅ ቀን እና ሰዓት ይዘን እናሳውቆታለን። እባክዎ ይከታተሉ!
                </p>
              </div>
              
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

    const { data, error } = await resend.emails.send({
      from: "Pathway Agency <notifications@pathwayet.com>",
      to: toEmail,
      replyTo: "pathwayagency15@gmail.com",
      subject: `🎉 Congratulations! Your Application is Accepted`,
      html,
    });

    if (error) {
      console.error("Resend error:", JSON.stringify(error));
      const msg = typeof error === 'string' ? error : (error as any)?.message || JSON.stringify(error);
      return NextResponse.json({ error: msg }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error("API error:", err);
    const msg = typeof err === 'string' ? err : err?.message || 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
