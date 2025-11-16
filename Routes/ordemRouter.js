const express = require('express');
const ctrl = require('../Controller/ordemController');
const AuthMiddleware = require('../middlewares/authMiddleware');
let auth = new AuthMiddleware();
const router = express.Router();

// gerenciamento (painel)
router.get('/ordens', auth.validar, ctrl.ordensView.bind(ctrl));
router.get('/relatorios', auth.validar, ctrl.relatoriosView.bind(ctrl));
router.get('/ordens/list_json', auth.validar, ctrl.listJson.bind(ctrl));
router.get('/relatorio/periodo', auth.validar, ctrl.relatorioPorPeriodo.bind(ctrl));
router.get('/relatorio/cliente', auth.validar, ctrl.relatorioPorCliente.bind(ctrl));
router.get('/relatorio/servico', auth.validar, ctrl.relatorioPorServico.bind(ctrl));
router.get('/relatorio/status', auth.validar, ctrl.relatorioPorStatus.bind(ctrl));
router.get('/relatorio/marca', auth.validar, ctrl.relatorioPorMarca.bind(ctrl));
router.get('/relatorios/pdf', auth.validar, ctrl.relatorioPdf.bind(ctrl));

// APIs públicas
router.post('/ordens/abrir', ctrl.abrirOrdemPublica.bind(ctrl)); // público, usado pelo site
router.post('/ordens/concluir', auth.validar, ctrl.concluirOrdem.bind(ctrl));

module.exports = router;
