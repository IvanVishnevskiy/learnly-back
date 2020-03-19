const checkLogin = require('../../shared/checkLogin/check')
const mongo = require('../../shared/mongo')

const { ObjectID } = require('mongodb')
const getDictionary = require('../getDictionary/index')

exports.connect = async connection => {
  const { decline, data } = connection
  const user = await checkLogin(connection)
  const { error, email } = user
  if(error) return decline(403, 'Not authorized')

  const db = await mongo()
  const words = db.collection('words')
  const users = db.collection('users')
  const { id, wordId, word } = data
  if(!id || !wordId || !word) return decline(156, 'No word to remove')
  try {
    await words.updateOne({ word }, { 
      $pull: { wordParams: { _id: ObjectID(wordId) } } 
    })
  }
  catch(e) {
    console.log(e)
  }
  await users.updateOne({ email }, {
    $pull: { 'dictionaries.$[dictionary].words': { id: ObjectID(wordId) } }
  }, { arrayFilters: [ { 'dictionary.id': ObjectID(id) } ] })

  return await getDictionary.connect(connection)
}