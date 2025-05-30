
const nodemailer = require("nodemailer")

const resetPasswordEmail = async ( email, token )=>{

    const mailTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.EMAIL_PASSWORD}`
        }
    })

    const mailDetails = {
        from: `${process.env.EMAIL}`,
        to: `${email}`,
        subject: "Password Reset Notification",
        html: `<h5>Here is the token for your password reset, please click the button below, ${token}</h5>`
    }
    await mailTransport.sendMail(mailDetails)
}

module.exports = resetPasswordEmail