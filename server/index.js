const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { addNote, getNotes } = require('./notes.controller');
const { loginUser } = require('./users.controller');
const auth = require('./middlewares/auth');

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	}),
);
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	next();
});

app.post('/login', async (req, res) => {
	try {
		const token = await loginUser(req.body.login, req.body.password);

		res.cookie('token', token, { httpOnly: true });

		res.json({
			redirect: '/table',
			error: false,
		});
	} catch (e) {
		res.json({
			notes: [],
			error: 'Ошибка c доступом!.',
		});
	}
});

app.get('/logout', async (req, res) => {
	res.cookie('token', '', { httpOnly: true });
	res.json({
		redirect: '/login',
		error: false,
	});
});

app.post('/requests', async (req, res) => {
	try {
		await addNote(req.body.fullName, req.body.phone, req.body.problemDescription);
		res.json({
			notes: await getNotes(),
			error: false,
		});
	} catch (e) {
		res.json({
			notes: [],
			error: 'Ошибка! Попробуйте позднее.',
		});
	}
});

app.use(auth);

app.get('/requests', async (req, res) => {

	try {
		res.json({
			notes: await getNotes(),
			userLogin: req.user.login,
			error: false,
		});
	} catch (error) {
		res.json({
			notes: [],
			error: 'Ошибка! Попробуйте позднее.',
		});
	}
});

mongoose
	.connect('mongodb://admin_project2:password_project2@localhost:27018/')
	.then(() => {
		app.listen(port, () => {
			console.log(chalk.green(`Server has been stsrted on port ${port}... `));
		});
	});
