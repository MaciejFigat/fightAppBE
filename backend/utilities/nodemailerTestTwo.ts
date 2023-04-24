import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

const sendEmailTest = async (
  userEmail: string,
  subject: string,
  text: string,
  htmlBody: string
) => {
  dotenv.config()

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    })

    await transporter.sendMail({
      from: process.env.USER,
      to: userEmail,
      subject: subject,
      text: text,
      html: htmlBody
    })

    console.log('email sent sucessfully')
  } catch (error) {
    console.log(error, 'email not sent')
  }
}

export default sendEmailTest
