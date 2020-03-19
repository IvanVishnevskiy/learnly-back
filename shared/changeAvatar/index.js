const mongo = require('../mongo')
const Jimp = require('jimp')
const checkLogin = require('../checkLogin/check')
const path = require('path')
const sha256 = require('js-sha256')

exports.connect = async connection => {
  const db = await mongo()
  
  const users = db.collection('users')
  const { decline, data } = connection
  const { image } = data
  const user = await checkLogin(connection)
  const { active } = user
  if(!active) return decline(403, 'Not authorized')
  const [ ,rawContent ]  = image.split('base64,')
  let ourImage = await Jimp.read(Buffer.from(rawContent.replace(/^data:image\/png;base64,/, ""), 'base64'))
  const name = `${ourImage.hash()}.jpg`
  const { width, height } = ourImage.bitmap
  if(width > 600) ourImage = await ourImage.resize(600, Jimp.AUTO)
  if(height > 1000) ourImage = await ourImage.resize(Jimp.AUTO, 1000)
  await ourImage.quality(75).write(path.resolve(connection.staticPath, 'english', 'images', name))

  const { email } = user
  await users.updateOne({ email }, { $set: { avatar: `/english/images/${name}` }})
  return { text: { error: 0, avatar: `/english/images/${name}` } }
}