const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = `mongodb://127.0.0.1:27017`
const databaseName = `task-manager`

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log(`Unable to connect to database!`)
    }

    // 特定のデータベースへの参照の取得(引数にはデータベースの名前)
    const db = client.db(databaseName)
})
