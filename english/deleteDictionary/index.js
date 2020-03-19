const checkLogin = require('../../shared/checkLogin/check')
const mongo = require('../../shared/mongo')

exports.connect = async (connection) => {
  const { decline, data } = connection
  const user = await checkLogin(connection)
  const { error, email } = user
  if(error) return decline(403, 'Not authorized')

  const { id } = data
  if(!id) return decline(110, 'No dictionary to delete')
  const db = await mongo()
  const users = db.collection('users')

  await users.updateOne({ email }, { $pull: { 'dictionaries': { id } } })
  return { text: { dictionaries: user.dictionaries.filter(dict => dict.id !== id) } }
}