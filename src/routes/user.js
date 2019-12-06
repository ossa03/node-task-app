const express = require('express')
const User = require('../models/user')

const router = express.Router()

//* Create user
router.post('/users', async (req, res) => {
	const user = new User(req.body)
	try {
		await user.save()
		res.status(201).send(user)
	} catch (e) {
		res.status(400).send()
	}
})

//* Login
router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password)
		// const token = await user.generateAuthToken()
		res.send(user)
	} catch (e) {
		console.log('@', e) // THIS IS THE NEW LINE
		res.status(400).send()
	}
})

//* Read users
router.get('/users', async (req, res) => {
	try {
		const users = await User.find({})
		res.send(users)
	} catch (e) {
		res.status(500).send()
	}
})

//* Read users single
router.get('/users/:id', async (req, res) => {
	// const _id = req.params.id
	try {
		const user = await User.findById(req.params.id)
		if (!user) {
			return res.status(404).send()
		}
		res.send(user)
	} catch (e) {
		res.status(500).send()
	}
})

//* Update user
router.patch('/users/:id', async (req, res) => {
	//* strong parameter みたいなもん
	const updates = Object.keys(req.body) // Object.keysに渡したオブジェクトのkeyの配列を返す
	const allowedUpdates = ['name', 'email', 'age', 'password']
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
	// isValidOperation : Boolean, すべて通ればtrue,一つでもfalseがあればfalse
	// every() メソッドは、与えられた関数によって実行されるテストに、配列のすべての要素が通るかどうかをテストします。
	// 引数updateには配列updatesの要素が一つずつ渡されていく

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' })
	}
	//* strong parameter ここまで

	try {
		// const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
		// userSchema.pre('save')を適応させるために上のコードをわける。
		// user.save()が欲しい
		const user = await User.findById(req.params.id)
		updates.forEach((update) => (user[update] = req.body[update]))
		await user.save()

		if (!user) {
			return res.status(404).send()
		}

		res.send(user)
	} catch (e) {
		res.status(400).send(e)
	}
})

//* Delete user
router.delete('/users/:id', async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id)
		if (!user) {
			return res.status(404).send()
		}
		res.send(user)
	} catch (e) {
		res.status(500).send()
	}
})

module.exports = router
