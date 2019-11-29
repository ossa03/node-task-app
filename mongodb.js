// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;
const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = `mongodb://127.0.0.1:27017`;
const databaseName = `task-manager`;

MongoClient.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        return console.log(`Unable to connect to database!`);
    }

    const db = client.db(databaseName);

    db.collection('tasks').deleteOne({ description: 'iPhone 9' })
        .then(result => {
            console.log(result);
        }).catch(err => {
            console.log(err);
        })
});


