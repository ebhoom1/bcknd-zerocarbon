const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anusreee2912@gmail.com", // your gmail
      pass:"knorbaopdxlvmqsh", // your app password
    },
  });

  const mailOptions = {
    from: `"Ebhoom ESG Support" <"info.ebhoom@gmail.com">`,
    to,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
