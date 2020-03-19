const checkLogin = require('../../shared/checkLogin/check')
const mongo = require('../../shared/mongo')
const { ObjectID } = require('mongodb')

exports.connect = async (connection) => {
  const { decline, data } = connection
  const { fromOne } = data
  const user = await checkLogin(connection)
  const { error, email } = user
  if(error) return decline(403, 'Not authorized')

  const db = await mongo()
  const users = db.collection('users')

  const newDictionary = {
    name: 'Новый словарь',
    description: 'Без описания',
    words: [],
    fields: [{ title: 'Слово или фраза', name: 'word' }, { title: 'Перевод' }],
    wordCount: 0,
    assignedTexts: [],
    id: ObjectID(),
    texts: []
  }

  if(!user.dictionaries) await users.updateOne({ email }, { $set: { 'dictionaries': [] } })
  await users.updateOne({ email }, { $push: { 'dictionaries': newDictionary } })

  return { text: { dictionaries: [ ...(user.dictionaries || []), newDictionary ] } }
}