const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dronsaini870@gmail.com",     // DEV only
    pass: "kuit umrh eeci oyxi",
  },
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: "dronsaini870@gmail.com",
    to: email,
    subject: "Email Verification OTP",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `,
  });
};

module.exports = sendOTP;
