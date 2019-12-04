//* モジュール
const express = require('express')
// データベースに接続するため'mongoose.js'全体をインポート.requireした時点で接続される.
require('./db/mongoose.js')

const app = express()
const PORT = process.env.PORT || 3000
const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

//* middleware
// postされたjsonを自動でオブジェクトに変換してくれる
app.use(express.json())

//* ルーティング
app.use(userRouter)
app.use(taskRouter)

//* サーバー起動
app.listen(PORT, () => {
	console.log(`Server starting port ${PORT} ...`)
})
