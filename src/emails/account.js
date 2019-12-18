const sgMail = require('@sendgrid/mail')

// set sendGrid APIKey
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

//* sendWelcomeEmail
const sendWelcomeEmail = (email, name) => {
	const message = {
		to: email,
		from: `kfcxd953pelo+dev@gmail.com`,
		subject: `Thank you joining this app !`,
		text: `Hello ${name}`,
	}

	sgMail.send(message)
}

//* sendCancelEmail
const sendCancelEmail = (email, name) => {
	const message = {
		to: email,
		from: 'kfcxd953pelo+dev@gmail.com',
		subject: 'Canceled joining this app',
		text: `Goodbye ${name} We'll wait for you to come again`,
	}

	sgMail.send(message)
}

module.exports = {
	sendWelcomeEmail,
	sendCancelEmail,
}
