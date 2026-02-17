require('dotenv').config();
const nodemailer = require("nodemailer");

async function mailer(mailOptions) 
{
  try 
  {
    let transport = nodemailer.createTransport(
    {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: 
      {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      logger: true,
      debug: process.env.NODE_ENV !== "production"
    });

    // Fire-and-forget send
    transport.sendMail(mailOptions)
      .then(() => console.log("✅ Order confirmation email sent successfully"))
      .catch(err => console.error("❌ Mail error:", err));

  } 
  catch (error) { console.error("❌ Transport setup failed:", error) }
}

module.exports = mailer;
