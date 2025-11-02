const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../constants');

function auth(req, res, next) {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({
			error: 'Необходимо авторизоваться и предоставить токен',
			redirect: '/login',
		});
	}

	try {
		const verifyResult = jwt.verify(token, JWT_SECRET);
		req.user = {
			login: verifyResult.login,
		};
		next();
	} catch (e) {
		console.error(e.message);
		return res.status(401).json({
			error: 'Некорректный токен',
			redirect: '/login',
		});
	}
}

module.exports = auth;
