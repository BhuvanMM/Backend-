import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

export const sendEmail = async(toMail,subject,body)=>{
    const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL, 
        to: toMail, 
        subject: subject, 
        html: body, 
      });
}