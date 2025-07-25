const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config(); // Load env variables

const sendEmail = async (to, otp) => {
  // 1. Render EJS template with OTP
  const htmlContent = await ejs.renderFile(
    path.join(__dirname, "../views/otpEmailTemplate.ejs"),
    { otp }
  );
  console.log(htmlContent);

  // 2. Setup transporter with ENV values
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: "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",
    },
  });
  console.log(process.env.MAIL_HOST);

  try {
    const info = await transporter.sendMail({
      from: `rchaudhary@grepruby.io`,
      to,
      subject: "Your OTP Code",
      html: htmlContent,
    });
    console.log("Email sent", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }

  // 3. Send email
};

module.exports = sendEmail;
