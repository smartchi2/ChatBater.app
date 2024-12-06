// emailSender.js
const nodemailer = require("nodemailer");

const chatBaterEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // You can use another service like Outlook, Yahoo, etc.
      auth: {
        user: "smartmediaupdate247@gmail.com", // Replace with your email
        pass: "  iasy syjt izax bsay ", // Replace with your password or app password
      },
    });

    const mailOptions = {
      from: '"ChatBater" <smartmediaupdate247@gmail.com>', // Sender address
      to, // Recipient email address
      subject, // Subject line
      html: htmlContent, // Email content in HTML format
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

module.exports = chatBaterEmail;
