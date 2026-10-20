
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE !== "false",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

async function sendEmail({ to, subject, text }) {
  return transporter.sendMail({
    from: `"O Positive Health" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    text,
  });
}

module.exports = sendEmail;
