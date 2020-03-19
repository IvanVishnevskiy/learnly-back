const mongo = require('../mongo')
const sendEmail = require('../email/send/index')

exports.connect = async connection => {
  const db = await mongo()
  const users = db.collection('users')
  const { decline, data = {} } = connection
  const { code, email, keyToken } = data

  if(!email) return decline(101, 'No E-mail!')
  if(!code) return decline(101, 'No keyCode')
  const user = await users.findOne({ email, emailCode: code, keyToken }) 
  console.log(user)
  if(user) {
    await users.updateOne({ email }, { $unset: { keyToken: '', emailCode: '' }, $set: { 'active': true } })
    const { nickname } = user
    await sendEmail({ 
      from: 'signup', 
      to: email, 
      subject: '[Forgetable] Успешная регистрация',
      text: `Спасибо, ${nickname}, за регистрацию!`
    })
  }
  else return decline(104, 'Wrong key')
  
  return { text: { error: 0 } }
}