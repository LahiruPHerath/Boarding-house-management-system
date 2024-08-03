const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "laiyahera9@gmail.com",
      pass: "brym sann gcgz bvmc",
    },
  });

  let mailOptions = {
    from: '"Boarding House Management" <laiyahera9@gmail.com>',
    to: to,
    subject: subject,
    html: htmlContent, // Use the HTML content here
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
