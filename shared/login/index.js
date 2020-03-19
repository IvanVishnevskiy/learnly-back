const mongo = require('../mongo')
const sha256 = require('js-sha256')
const jwt = require('jsonwebtoken')
const { salt, jwtKey } = require('../config')


exports.connect = async connection => {
  const db = await mongo()
  const users = db.collection('users')
  const { decline, data, res } = connection
  const { email, password } = data
  if(!email || !password) return decline(101, 'Wrong password and/or username')
  const existingUser = await users.findOne({ email, password: sha256(password + salt) })
  if(existingUser) {
    const { email, _id } = existingUser
    const [sessionError, session] = 
    await new Promise(resolve => 
      jwt.sign({ email, id: _id }, jwtKey, (err, token) => resolve([err, token]) )
    )
    if(sessionError) return decline(104, 'Trouble with creating session. Please try again.')
    // res.setHeader('Set-Cookie', `session=${session}`)
    return { text: { session, email: existingUser.email, nickname: existingUser.nickname } }
  }
  return decline(103, 'Wrong login or password')
}