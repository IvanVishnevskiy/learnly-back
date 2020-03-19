const checkLogin = require('../../shared/checkLogin/check')
const { ObjectID } = require('mongodb')

exports.connect = async (connection) => {
  const { decline, data } = connection
  const { id } = data
  const user = await checkLogin(connection)
  const { error } = user
  if(error) return decline(403, 'Not authorized')
  console.log(user.dictionaries, id)
  const dictionary = user.dictionaries.find(dict => ObjectID(dict.id).equals(ObjectID(id)))
  if(!dictionary) return { text: { error: 112, errorname: 'No dictionary with this id.' }}
  return { text: dictionary }
}