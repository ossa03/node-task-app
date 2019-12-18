const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')

const router = express.Router()

//* Create user (Signup)
router.post('/users', async (req, res) => {
	const user = new User(req.body)
	try {
		await user.save()
		sendWelcomeEmail(user.email, user.name)
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
		sendCancelEmail(req.user.email, req.user.name)
		res.send(req.user)
	} catch (e) {
		res.status(500).send()
	}
})

//* multer setup
const upload = multer({
	// dest: 'avatars', // 保存先のディレクトリ名(path)
	// これを削除すると第3引数のコールバックのreq.file.bufferにバイナリデータが渡せる
	limits: {
		fileSize: 1000000, // 1MB
	},
	fileFilter(req, file, cb) {
		// jpeg,jpg,pngのみ許可する
		if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
			return cb(new Error('Please upload a image only extname is (jpeg,jpg,png)'))
		}
		cb(undefined, true)
	},
})

//* Upload file
router.post(
	'/users/me/avatar',
	auth,
	upload.single('avatar'), // req.file.avatar でアップロードしたいデータ(Buffer)にアクセスできる
	async (req, res) => {
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer()

		// req.user.avatar = req.file.buffer
		req.user.avatar = buffer
		await req.user.save()
		req.res.send()
	},
	// エラーハンドリングのコールバック
	(err, req, res, next) => {
		res.status(400).send({ error: err.message })
	},
)

//* Delete file
router.delete('/users/me/avatar', auth, async (req, res) => {
	req.user.avatar = undefined
	await req.user.save()
	res.send()
})

//* avatar アクセスポイント
router.get('/users/:id/avatar', async (req, res) => {
	try {
		const user = await User.findById(req.params.id)

		if (!user || !user.avatar) {
			throw new Error()
		}

		res.set('Content-Type', 'image/png')
		res.send(user.avatar)
	} catch (e) {
		res.status(404).send()
	}
})

module.exports = router
