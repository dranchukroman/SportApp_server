import transporter from "../../config/email.js";

export async function sendEmailWithVerificationCode(email, code) {
  try {
    const mailOptions = {
      from: `"Sport App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}`,
      html: `
            <div style="font-family: sans-serif;">
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h3 style="color: #007bff;">${code}</h3>
            <p>This code will expire in 10 minutes.</p>
            </div>
          `,
    };

    const result = await transporter.sendMail(mailOptions);
    return result.accepted.length > 0;
  } catch (error) {
    console.error(`Error sending email:`, error);
  }
};