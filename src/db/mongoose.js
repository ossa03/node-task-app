const mongoose = require('mongoose')

// database setup
const databaseName = 'task-manager-api'
mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})
