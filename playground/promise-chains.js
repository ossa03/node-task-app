require('../src/db/mongoose')
const User = require('../src/models/user')

// 5de0afb9b9c2f027cda20ddb
//* promiseChain
// User.findByIdAndUpdate('5de0afb9b9c2f027cda20ddb', { age: 1 })
// 	.then(user => {
// 		console.log(user)
// 		return User.countDocuments({ age: 1 })
// 	})
// 	.then(count => {
// 		console.log(count)
// 	})
// 	.catch(err => {
// 		console.log(err)
// 	})

//* async await
const updateAgeAndCount = async (id) => {
    const user = await User.findByIdAndUpdate(id, { age: 1 })
    const count = await User.countDocuments({ age: 1 })
    return count
}

// console.log(updateAgeAndCount) ==> promiseObject
updateAgeAndCount('5de0afb9b9c2f027cda20ddb')
    .then(count => console.log(count))
    .catch(err => console.log(err))
