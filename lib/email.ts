import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT ?? '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `"TradingPro" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Your TradingPro login code: ${otp}`,
    html: `
      <div style="font-family:sans-serif;background:#0f1117;color:#fff;padding:40px 0;min-height:100vh">
        <div style="max-width:480px;margin:0 auto;background:#1a1f2e;border:1px solid #1f2937;border-radius:16px;padding:40px">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px">
            <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#3b82f6,#00d395);display:flex;align-items:center;justify-content:center">
              <span style="color:#fff;font-weight:bold;font-size:18px">T</span>
            </div>
            <span style="font-size:20px;font-weight:bold;color:#fff">TradingPro</span>
          </div>

          <h2 style="margin:0 0 8px;color:#fff;font-size:22px">Your login code</h2>
          <p style="color:#6b7280;margin:0 0 32px;font-size:14px">
            Use this code to sign in to your TradingPro account. It expires in 10 minutes.
          </p>

          <div style="background:#0f1117;border:1px solid #374151;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px">
            <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#00d395;font-family:monospace">${otp}</span>
          </div>

          <p style="color:#6b7280;font-size:13px;margin:0">
            If you didn't request this code, you can safely ignore this email.<br/>
            This code is valid for a single use only.
          </p>

          <hr style="border:none;border-top:1px solid #1f2937;margin:32px 0"/>
          <p style="color:#374151;font-size:12px;margin:0">
            ⚠️ Trading involves risk. TradingPro provides analysis tools, not financial advice.
          </p>
        </div>
      </div>
    `,
    text: `Your TradingPro login code is: ${otp}\n\nThis code expires in 10 minutes and can only be used once.`,
  })
}
