const express = require('express');
const crtl= require('../Controller/gereMarca');
const AuthMiddleware = require('../middlewares/authMiddleware');
let auth = new AuthMiddleware();

const router = express.Router();

router.get('/formulariomarca',auth.validar, crtl.formularioMarcaView.bind(crtl));
router.get('/formulariomarca/:id',auth.validar, crtl.formularioMarcaView.bind(crtl)); 
router.post('/cadastrar',auth.validar, crtl.cadastrarMarca.bind(crtl));
router.post('/atualizar',auth.validar, crtl.atualizarMarca.bind(crtl));
router.post('/excluir',auth.validar, crtl.excluirMarca.bind(crtl));

module.exports = router;