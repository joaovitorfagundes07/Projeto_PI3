const express = require('express');
const crtl = require('../Controller/gereServicos');
const AuthMiddleware = require('../middlewares/authMiddleware');
let auth = new AuthMiddleware();

const router = express.Router();

router.get('/formularioservicos',auth.validar, crtl.formularioServicoView.bind(crtl));
router.get('/formularioservicos/:id',auth.validar, crtl.formularioServicoView.bind(crtl)); 
router.post('/cadastra',auth.validar, crtl.cadastrarServico.bind(crtl));
router.post('/atualizar',auth.validar, crtl.atualizarServico.bind(crtl));
router.post('/excluir',auth.validar, crtl.excluirServico.bind(crtl));

module.exports = router;