const MongoClient = require('mongodb').MongoClient
const config = require('./config')
mongos = {

}

module.exports = async () => {
  const dbName = 'main'
  if(mongos[dbName]) return mongos[dbName]
  const url = config.mongoURL
  const client = new MongoClient(url)
  const db = await new Promise((resolve, reject) => {
    client.connect(err => {
      if(err) return reject(err)
      const db = client.db(dbName)
      mongos[dbName] = db
      resolve(db)
    })
  })
  return db
}
