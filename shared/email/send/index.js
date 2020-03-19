const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  pool: true,
  host: "smtp.yandex.com",
  port: 465,
  secure: true, // use TLS
  auth: {
    user: "io@forgetable.ru",
    pass: "473279068a"
  }
})

transporter.verify(function(error, success) {
  if (error) {
    console.log(error)
  } else {
    console.log("Server is ready to take our messages")
  }
})

module.exports = message => {
  message.from = message.from ? `${message.from}@forgetable.ru` : 'info@forgetable.ru'
  transporter.sendMail(message)
}