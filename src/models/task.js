// Taskモデル

//* モジュール
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//* model Task 定義
// schema
const taskSchema = new mongoose.Schema({
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

// //* preSave
// taskSchema.pre('save', async function(next) {
// 	const task = this

// 	if (task.isModified('')) next()
// })

const Task = mongoose.model(`Task`, taskSchema)

module.exports = Task
