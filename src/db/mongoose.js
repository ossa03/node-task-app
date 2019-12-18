const mongoose = require('mongoose')

// database setup
mongoose.connect(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})
