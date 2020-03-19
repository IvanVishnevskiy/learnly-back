const checkLogin = require('../../shared/checkLogin/check')
const mongo = require('../../shared/mongo')

const { ObjectID, DBRef } = require('mongodb')
const getDictionary = require('../getDictionary/index')

exports.connect = async connection => {
  const { decline, data } = connection
  const user = await checkLogin(connection)
  const { error, email } = user
  if(error) return decline(403, 'Not authorized')

  const db = await mongo()
  const words = db.collection('words')
  const users = db.collection('users')
  const { id, word, _session, ...wordParams } = data
  if(!id || !word) return decline(156, 'Wrong parameters')
  wordParams._id = user._id
  let _id

  try {
    await words.updateOne({ word }, { $push: { wordParams } })
    word = await words.findOne({ word })
    _id = ObjectID(word._id)
  }
  catch(e) {
    _id = ObjectID()
    console.log('generated ID', _id)
    await words.insertOne({ id: _id, word, wordParams: [ wordParams ] })
  }
  await users.updateOne({ email }, {
    $push: { 'dictionaries.$[dictionary].words': { id: ObjectID(), word, ...wordParams, reference: new DBRef('words', _id) } }
  }, { arrayFilters: [ { 'dictionary.id': ObjectID(id) } ] })

  return await getDictionary.connect(connection)
}