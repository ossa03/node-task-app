// Userモデル

//* モジュール
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

//* model User 定義
// schema
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
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

//* 静的関数 'Schema.statics' で original関数をsetできる
// emailとpasswordでuserを検索する関数
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email })
	if (!user) {
		throw new Error('Login failed. Email or Password was wrong')
	}

	const isMatch = await bcrypt.compare(password, user.password) //Boolean
	console.log(isMatch)
	if (!isMatch) {
		throw new Error('Login failed. Email or Password was wrong')
	}

	return user
}

//* preSave
userSchema.pre('save', async function(next) {
	const user = this

	// 'password'プロパティに変更があった場合true
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}

	next()
})

const User = mongoose.model(`User`, userSchema)

module.exports = User
