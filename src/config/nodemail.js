require('dotenv/config')
const nodemailer = require('nodemailer')

const user = process.env.GAZIN_EMAIL
const pass = process.env.GAZIN_SENHA

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
        user,
        pass
    }
})

module.exports = transporter