const checkLogin = require('../../shared/checkLogin/check')
const mongo = require('../../shared/mongo')
const { ObjectID } = require('mongodb')

const getDictionary = require('../getDictionary/index')

exports.connect = async (connection) => {
  const { decline, data } = connection
  const user = await checkLogin(connection)
  const { error, email } = user
  if(error) return decline(403, 'Not authorized')

  const { id, name, text } = data
  if(!id) return decline(110, 'No dictionary to change parameters for')
  const db = await mongo()
  const users = db.collection('users')

  await users.updateOne({ email }, {
    $push: { 'dictionaries.$[dictionary].texts': { name, text } }
  }, { arrayFilters: [ { 'dictionary.id': ObjectID(id) } ] })

  return await getDictionary.connect(connection)
}