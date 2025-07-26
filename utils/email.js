const { Resend } = require("resend");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config(); // Load env variables

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);
const sendEmail = async (to, otp) => {
  // 1. Render EJS template with OTP
  const htmlContent = await ejs.renderFile(
    path.join(__dirname, "../views/otpEmailTemplate.ejs"),
    { otp }
  );
  console.log(htmlContent);

  try {
    const info = await resend.emails.send({
      from: "support@expendo.dev",
      to,
      subject: "Your OTP Code",
      html: htmlContent,
    });
    if (info.error) {
      throw new Error(info.error.message);
    }
    console.log("info", info.error.message);
    return;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }

  // 3. Send email
};

module.exports = sendEmail;
