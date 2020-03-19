const mongo = require('../mongo')
const ObjectID = require('mongodb').ObjectID
const jwt = require('jsonwebtoken')

const { jwtKey } = require('../config')

const verifyToken = (token, key) => 
  new Promise(resolve => jwt.verify(token, key, (err, res) => resolve([err, res])))

module.exports = async connection => {
  const db = await mongo()
  const users = db.collection('users')
  const { data } = connection
  const { _session } = data
  if(!_session) return {}
  const [ sessionError, sessionData ] = await verifyToken(_session, jwtKey)
  if(sessionError) return {}
  const { id } = sessionData
  const loggedUser = await users.findOne({ _id: new ObjectID(id) })
  return loggedUser
}