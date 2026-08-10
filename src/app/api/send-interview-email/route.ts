import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { toEmail, toName, interviewDate, interviewTime, sector, role } = await req.json();

    if (!toEmail || !toName || !interviewDate || !interviewTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const logoUrl = "https://pathwayet.com/logo.png";

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Interview Appointment - Pathway Agency</title>
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
              <h2 style="color:#1e293b;font-size:20px;font-weight:800;margin:0 0 12px;">🎉 Interview Appointment Confirmed!</h2>
              <p style="color:#475569;font-size:15px;line-height:1.7;margin:0 0 20px;">
                Dear <strong>${toName}</strong>,<br/><br/>
                Congratulations! We are pleased to inform you that your application at <strong>Pathway Agency Ethiopia</strong> has been reviewed and you have been selected for an interview.
              </p>

              <!-- Interview Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:2px solid #bfdbfe;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#1e40af;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 14px;">📅 Interview Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:14px;width:40%;">Date</td>
                        <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:700;">${interviewDate}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:14px;">Time</td>
                        <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:700;">${interviewTime}</td>
                      </tr>
                      ${sector ? `<tr><td style="padding:6px 0;color:#64748b;font-size:14px;">Sector</td><td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:700;">${sector}</td></tr>` : ""}
                      ${role ? `<tr><td style="padding:6px 0;color:#64748b;font-size:14px;">Position</td><td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:700;">${role}</td></tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color:#475569;font-size:14px;line-height:1.7;margin:0 0 28px;">
                Please make sure to arrive <strong>10–15 minutes early</strong> with all your original documents. We look forward to meeting you!
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:2px dashed #e2e8f0;margin:28px 0;" />

              <!-- Amharic Section -->
              <h2 style="color:#1e293b;font-size:20px;font-weight:800;margin:0 0 12px;">🎉 የቃለ-መጠይቅ ቀጠሮ ተረጋግጧል!</h2>
              <p style="color:#475569;font-size:15px;line-height:1.8;margin:0 0 20px;">
                ውድ <strong>${toName}</strong>,<br/><br/>
                እንኳን ደስ አለዎ! ማመልከቻዎ በ<strong>Pathway Agency Ethiopia</strong> ተገምግሞ ለቃለ-መጠይቅ ተመርጠዋል።
              </p>

              <!-- Amharic Interview Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:14px;overflow:hidden;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="color:#166534;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin:0 0 14px;">📅 የቃለ-መጠይቅ ዝርዝሮች</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:14px;width:40%;">ቀን</td>
                        <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:700;">${interviewDate}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#64748b;font-size:14px;">ሰዓት</td>
                        <td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:700;">${interviewTime}</td>
                      </tr>
                      ${sector ? `<tr><td style="padding:6px 0;color:#64748b;font-size:14px;">ዘርፍ</td><td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:700;">${sector}</td></tr>` : ""}
                      ${role ? `<tr><td style="padding:6px 0;color:#64748b;font-size:14px;">ቦታ</td><td style="padding:6px 0;color:#1e293b;font-size:14px;font-weight:700;">${role}</td></tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color:#475569;font-size:14px;line-height:1.8;margin:0 0 8px;">
                ሁሉንም ዋና ሰነዶችዎን ይዘው ከቃለ-መጠይቁ <strong>10–15 ደቂቃ አስቀድመው</strong> እንዲደርሱ ይጠየቃሉ። እናንተን ለማስተናገድ እናጓጓለን!
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

    const { data, error } = await resend.emails.send({
      from: "Pathway Agency <notifications@pathwayet.com>",
      to: toEmail,
      replyTo: "pathwayagency15@gmail.com",
      subject: `🎉 Interview Appointment Confirmed — ${interviewDate} at ${interviewTime}`,
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
