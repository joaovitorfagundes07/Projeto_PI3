const express = require('express');
const loginController = require('../Controller/loginController');
const AuthMiddleware = require('../middlewares/authMiddleware');
let auth = new AuthMiddleware();

const router = express.Router();

router.get('/', (req, res) => loginController.loginView(req, res));
router.post('/', (req, res) => loginController.login(req, res));
router.get('/campos',auth.validar, loginController.camposView);

module.exports = router;