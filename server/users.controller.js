const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./constants');

async function loginUser(login, password) {
	const user = await User.findOne({ login });

	if (!user) {
		throw new Error('Пользователь не найден!');
	}

	const isPasswordCorrect = await bcrypt.compare(password, user.password);

	if (!isPasswordCorrect) {
		throw new Error('Неправильный пароль');
	}

	return jwt.sign({ login }, JWT_SECRET, { expiresIn: '30d' });
}

module.exports = {
	loginUser,
};
