const checkLogin = require('./check')

exports.connect = async (connection, internal) => {
  const user = await checkLogin(connection)
  const { email, active } = user
  let response
  if((email && active)) {
    const res = { error: 0, ...user }
    if(!internal) {
      delete res.login
      delete res.password
      delete res._id
    }
    response = res
  }
  else response = { error: 100, errorname: 'Нет сессии' }
  return { text: response }
}