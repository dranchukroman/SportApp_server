import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationCode(email, mailOptions) {
  console.log(email)
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`Verification code sent to ${email}`);
    return result;
  } catch (error) {
    console.error(`Error sending email:`, error);
  }
};