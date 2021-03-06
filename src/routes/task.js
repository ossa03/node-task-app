const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = express.Router()

//* Create task
router.post(`/tasks`, auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

//* GET /tasks?completed=true
//* GET /tasks?limit=10&skip=2
//*sort GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {} //初期化
    const sort = {} //初期化

    // queryStringに'completed'があって、それがStringの'true'だったらtrueをセットする(デフォルトはfalse)
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user
            .populate({
                path: 'tasks',
                match: match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort: sort, //ex) createdAt:-1 or 1   -1は降順,1は昇順
                },
            })
            .execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(404).send()
    }
})

//* Read tasks single
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id: _id, owner: req.user._id })
        // ↑ == const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

//* Update task
router.patch('/tasks/:id', auth, async (req, res) => {
    // strong parameter
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    // isValidOperation : Boolean, すべて通ればtrue,一つでもfalseがあればfalse

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => (task[update] = req.body[update]))
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//* Delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
