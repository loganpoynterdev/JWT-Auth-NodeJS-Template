const User = require('../models/Users');
const jwt = require('jsonwebtoken');

//Error handler
const handleErrors = (err) => {
	console.log(err.message, err.code);
	let errors = { email: '', password: '' };

	//duplicate found
	if (err.code === 11000) {
		errors.email = 'Email already exists';
		return errors;
	}

	//incorrect email
	if (err.message === 'Incorrect email') {
		errors.email = 'Email does not exist';
		return errors;
	}

	//incorrect password
	if (err.message === 'Incorrect password') {
		errors.password = 'Email or password are not correct';
		return errors;
	}

	//validation errors
	if (err.message.includes('user validation failed')) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	return errors;
};

//Create JWT
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign({ id }, 'supersecretjwtsigner', {
		expiresIn: maxAge,
	});
};

//Auth Controllers = GET
module.exports.getSignUp = (req, res) => {
	res.render('signup');
};
module.exports.getLogin = (req, res) => {
	res.render('login');
};
module.exports.getLogout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
};

//Auth Controllers = POST
module.exports.postSignUp = async (req, res) => {
	const { firstName, lastName, email, password } = req.body;

	try {
		const user = await User.create({ firstName, lastName, email, password });
		const token = createToken(user._id);
		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(201).json({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};
module.exports.postLogin = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.login(email, password);
		const token = createToken(user._id);
		res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(200).json({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};
