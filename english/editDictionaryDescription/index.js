const checkLogin = require('../../shared/checkLogin/check')
const mongo = require('../../shared/mongo')
const { ObjectID } = require('mongodb')

exports.connect = async (connection) => {
  const { decline, data } = connection
  const user = await checkLogin(connection)
  const { error, email } = user
  if(error) return decline(403, 'Not authorized')

  const { id, name, description } = data
  if(!id) return decline(110, 'No dictionary to change parameters for')
  const db = await mongo()
  const users = db.collection('users')
  await users.updateOne({ 
    email,
    dictionaries: { $elemMatch: { id: ObjectID(id) } }
   }, {
    $set: { 
      'dictionaries.$.name': name,
      'dictionaries.$.description': description
    }
  })
  return { text: { name, description } }
}