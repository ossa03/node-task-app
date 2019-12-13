const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router()

//* Create user (Signup)
router.post('/users', async (req, res) => {
	const user = new User(req.body)
	try {
		await user.save()
		const token = await user.generateAuthToken()
		res.status(201).send({ user, token })
	} catch (e) {
		res.status(400).send()
	}
})

//* Login
router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password)
		const token = await user.generateAuthToken()

		// res.send({ user: user.getPublicProfile(), token })
		res.send({ user, token })
	} catch (e) {
		res.status(400).send()
	}
})

//* Read profile of current user
router.get('/users/me', auth, async (req, res) => {
	try {
		res.send(req.user)
	} catch (e) {
		res.status(500).send()
	}
})

//* Logout
router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token
		})
		await req.user.save()

		res.send()
	} catch (e) {
		res.status(500).send()
	}
})

//* Logout all
router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		// tokens配列を空にする => 空の配列をセットする
		req.user.tokens = []
		await req.user.save()

		res.send()
	} catch (e) {
		res.status(500).send()
	}
})

//* Update user
router.patch('/users/me', auth, async (req, res) => {
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
		// const req.user = await req.user.findById(req.params.id)
		updates.forEach((update) => (req.user[update] = req.body[update]))
		await req.user.save()

		res.send(req.user)
	} catch (e) {
		res.status(400).send(e)
	}
})

//* Delete user
router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove()
		res.send(req.user)
	} catch (e) {
		res.status(500).send()
	}
})

module.exports = router
