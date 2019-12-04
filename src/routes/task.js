const express = require('express')
const Task = require('../models/task')

const router = express.Router()

//* Create task
router.post(`/tasks`, async (req, res) => {
	const task = new Task(req.body)
	try {
		await task.save()
		res.status(201).send(task)
	} catch (e) {
		res.status(500).send()
	}
})

//* Read tasks
router.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({})
		res.send(tasks)
	} catch (e) {
		res.status(404).send()
	}
})

//* Read tasks single
router.get('/tasks/:id', async (req, res) => {
	const _id = req.params.id
	try {
		const task = await Task.findById(_id)
		res.send(task)
	} catch (e) {
		res.status(500).send()
	}
})

//* Update task
router.patch('/tasks/:id', async (req, res) => {
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
		const task = await Task.findById(req.params.id)
		updates.forEach((update) => (task[update] = req.body[update]))
		await task.save()

		if (!task) {
			return res.status(404).send()
		}

		res.send(task)
	} catch (e) {
		res.status(400).send(e)
	}
})

//* Delete task
router.delete('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id)
		if (!task) {
			return res.status(404).send()
		}
		res.send(task)
	} catch (e) {
		res.status(500).send()
	}
})

module.exports = router
