"use server";
import nodemailer from "nodemailer";

export const emailSend = async (email: string, otp: number) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });
    const mailOptions = {
      from: "Flow Fusion <hy945196@gmail.com>",
      to: email,
      subject: "Verification code for admin access",
      html: `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');

    body {
      font-family: 'Roboto', Verdana, sans-serif;
      margin: 0;
      padding: 0;
      font-weight: 400;
      font-style: normal;
    }
    .preview {
      font-size: 16px;
      margin: 20px;
    }
    .section {
      margin: 20px;
    }
    .row {
      margin-bottom: 10px;
    }
    .heading {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .text {
      font-size: 16px;
    }
    .highlight {
  font-weight: bold;
}
  </style>
</head>
<body>
<div class="section">
<div class="row">
<div class="heading">Hello ${email},</div>
</div>
<div class="row">
<div class="text">
Thank you for registering. Please use the following verification
code to complete your registration:
</div>
</div>
<div class="row">
<div class="preview">Here's your verification code:<span class="highlight">${otp}</span> </div>
    </div>
    <div class="row">
      <div class="text">
        If you did not request this code, please ignore this email.
      </div>
    </div>
  </div>
</body>
</html>`,
    };
    await transporter
      .sendMail(mailOptions)
      .then(() => {
        console.log(`Mail sent to${email} users`);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.error(error);
  }
};
