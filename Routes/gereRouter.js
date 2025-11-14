const express = require('express');
const ctrl = require('../Controller/gereController'); // já é a instância
const AuthMiddleware = require('../middlewares/authMiddleware');
let auth = new AuthMiddleware();

const router = express.Router();
router.get('/equipamentos',auth.validar, ctrl.equipamentoView);
router.get('/marcas',auth.validar, ctrl.marcaView);
router.get('/servicos',auth.validar, ctrl.servicosView);

module.exports = router;