const mongoose = require('mongoose');
const validator = require('validator');

// database setup
const databaseName = "task-manager-api"
mongoose.connect(`mongodb://127.0.0.1:27017/${databaseName}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// model定義
const User = mongoose.model(`User`, {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error(`Email is invalid`);
            }
        }
    },
    age: {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.includes(`password`)) {
                throw new Error("password is invalid");
            }
        }
    }
});

// Ex
// const hide = new User({
//     name: `hide`,
//     age: 32,
//     email: "validEMAIL@GMAIL.com",
//     // email: "invalid email",
//     password: "aaaaaa",
//     // password: "bbb",
//     // password: "password",
// });
// // save
// hide.save().then(() => {
//     console.log(hide);
// }).catch(err => {
//     console.log('Error! :', err);
// });


const Task = mongoose.model(`Task`, {
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const task = new Task({
    // description: "   daikon   ",
    // completed: true
});

task.save().then(() => {
    console.log(task);
}).catch(err => {
    console.log('Error! :', err);
})