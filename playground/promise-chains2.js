require('../src/db/mongoose')
const Task = require('../src/models/task')

//* promiseChain
// Task.findOneAndDelete({ _id: '5de35fc4abeeb37144948f07' })
// 	.then(task => {
// 		console.log(task)
// 		return Task.countDocuments({ completed: false })
// 	})
// 	.then(result => {
// 		console.log(result)
// 	})
// 	.catch(err => {
// 		console.log(err)
// 	})

//* async await
const deleteAndCount = async (id) => {
    const task = await Task.findOneAndDelete({ _id: id })
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteAndCount('5de35fc4abeeb37144948f07')
    .then(count => console.log(count))
    .catch(err => console.log(err))

//* Task追加
// Task.create([
// 	{
// 		description: '鶏もも',
// 		completed: false,
// 	},
// 	{
// 		description: '豚肉',
// 		completed: false,
// 	},
// 	{
// 		description: '牛肉',
// 		completed: true,
// 	},
// ])
// 	.then(result => {
// 		console.log(result)
// 	})
// 	.catch(err => {
// 		console.log(err)
// 	})
