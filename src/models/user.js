// Userモデル

//* モジュール
const mongoose = require('mongoose')
const validator = require('validator')

//* model User 定義
const User = mongoose.model(`User`, {
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error(`Email is invalid`)
			}
		},
	},
	age: {
		type: Number,
		default: 0,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		lowercase: true,
		minlength: 6,
		trim: true,
		validate(value) {
			if (value.includes(`password`)) {
				throw new Error('password is invalid')
			}
		},
	},
})

module.exports = User
