const mongo = require('../mongo')
const checkLogin = require('../checkLogin/check')

exports.connect = async connection => {
  const db = await mongo()
  const users = db.collection('users')
  const { decline, data } = connection
  const { image } = data
  const user = await checkLogin(connection)
  const { active, email } = user
  if(!active) return decline(403, 'Not authorized')

  await users.updateOne({ email }, { $set: { avatar: `` }})
  return { text: { error: 0, avatar: `` } }
}