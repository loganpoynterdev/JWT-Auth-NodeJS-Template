const { Router } = require('express');
const authController = require('../controllers/authController')

const router = Router();

//Registration Routes
router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignUp);

//Login Routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

//Logout Routes
router.get('/logout', authController.getLogout);
module.exports = router;