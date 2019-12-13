// Taskモデル

//* モジュール
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//* model Task 定義
// schema
const taskSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
			trim: true,
		},
		completed: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User', //* アソシエーション設定. Userモデルを参照
		},
	},
	{
		timestamps: true,
	},
)

const Task = mongoose.model(`Task`, taskSchema)

module.exports = Task
