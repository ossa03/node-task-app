// Taskモデル

//* モジュール
const mongoose = require('mongoose')

//* model Task 定義
const Task = mongoose.model(`Task`, {
	description: {
		type: String,
		required: true,
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
})

module.exports = Task
