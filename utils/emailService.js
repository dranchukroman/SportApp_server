import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendCode(email, mailOptions) {
  console.log(email)
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`Verification code sent to ${email}`);
    return result.accepted.length > 0;
  } catch (error) {
    console.error(`Error sending email:`, error);
  }
};