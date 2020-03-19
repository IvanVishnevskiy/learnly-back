const checkLogin = require('../../shared/checkLogin/check')

exports.connect = async (connection) => {
  const { decline } = connection
  const user = await checkLogin(connection)
  const { error } = user
  if(error) return decline(403, 'Not authorized')
  return { text: user.dictionaries ? user.dictionaries.map(({ id, name, description, wordCount }) => ({
    id,
    name,
    description,
    wordCount
  })) : [] }
}