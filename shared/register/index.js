const mongo = require('../mongo')
const sha256 = require('js-sha256')
const checkLogin = require('../checkLogin/check')
const sendEmail = require('../email/send/index')
// const xmpp = require('../xmpp')
const { salt } = require('../config')

exports.connect = async connection => {
  const db = await mongo()
  const users = db.collection('users')
  const { decline, declineWithError, data = {} } = connection
  const { email, nickname, login, password, update = false } = data
  if (update) {
    const data = {}
    if(password) data.password = password
    if(login) data.login = login
    data.dictionaries = []
    const user = await checkLogin(connection)
    const { email } = user
    if(!nickname) return declineWithError(403, 'Not Authorized')
    await users.updateOne({ email }, { $set: data })
    return { text: { error: 0 } }
  }
  if(!email) return decline(101, 'No E-mail!')
  if(!password) return decline(101, 'No password')
  const code = Array(4).fill(0).map(() => Math.floor(Math.random() * 10))
  const keyToken = Array(16).fill(0).map(() => String.fromCharCode(Math.floor(Math.random() * 40) + 40)).join('')
  const user = await users.findOne({ email })
  console.log(user)
  if(user && user.active) return decline(102, 'This e-mail is already registered.')
  else if(user) await users.updateOne({ email }, { $set: { emailCode: code.join(''), keyToken } } )
  else await users.insertOne({ email, nickname, login, password: sha256(password + salt), active: false, emailCode: code.join(''), keyToken }) 
  await sendEmail({ 
    from: 'signup', 
    to: email, 
    subject: '[Forgetable] Секретный ключ',
    text: '\n' + code.reduce((all, next) => all + ' ' + next)
  })
  return { text: { error: 0, keyToken } }
}