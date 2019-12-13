// Userモデル

//* モジュール
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

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
		validate(value) {
			if (value < 0) {
				throw new Error('Age must be a positive number')
			}
		},
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		trim: true,
		validate(value) {
			if (value.includes(`password`)) {
				throw new Error('password is invalid')
			}
		},
	},
	tokens: [
		{
			token: {
				type: String,
				required: true,
			},
		},
	],
})

//* リレーションシップ
userSchema.virtual('tasks', {
	ref: 'Task',
	localField: '_id',
	foreignField: 'owner',
})

//* 'Schema.methods.myFuncName'でインスタンスメソッドをsetできる.
// userSchema.methods.getPublicProfile = function() {
userSchema.methods.toJSON = function() {
	const user = this
	const userObject = user.toObject()
	// ドキュメントには、マングースドキュメントをプレーンなJavaScriptオブジェクトに変換するtoObjectメソッドがある

	delete userObject.password
	delete userObject.tokens

	return userObject
}

userSchema.methods.generateAuthToken = async function() {
	// インスタンスであるthisを扱うためにallow functionは使わない.
	const user = this

	// user._idをtokenとして使用する ->token._idが生成される
	const token = jwt.sign({ _id: user._id.toString() }, 'ossa')

	user.tokens = user.tokens.concat({ token })
	await user.save()

	return token
}
//* 静的関数 'Schema.statics.myFuncName' で original関数をsetできる
// emailとpasswordでuserを検索する関数
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email })

	if (!user) {
		throw new Error('Unable to login')
	}

	const isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch) {
		throw new Error('Unable to login')
	}

	return user
}

//* Save()する前に自動で行こなう
userSchema.pre('save', async function(next) {
	const user = this

	// 'password'プロパティに変更があった場合true
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8)
	}

	next()
})

//* userを削除するときにtaskも全部消す
userSchema.pre('remove', async function(next) {
	const user = this
	await Task.deleteMany({ owner: user._id })
	next()
})

const User = mongoose.model(`User`, userSchema)

module.exports = User
