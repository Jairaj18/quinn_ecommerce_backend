import nodemailer from 'nodemailer';
import asyncHandler from "express-async-handler";
export const sendEmail = asyncHandler(async (data, req, res) => {
    let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_ID, // your email
            pass: process.env.PASSWORD, // your email password
        },
    });

    // send mail with defined transport object
    const info = await transport.sendMail({
        from: '"Quinn 🛒" <support@quinn.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.html, // html body (corrected the typo here)
    });

    console.log("Message sent: %s", info.messageId);

    // Preview URL only for Ethereal accounts
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});
