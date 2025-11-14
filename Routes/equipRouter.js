const express = require('express');
const ctrl = require('../Controller/gereEquipamento');
const AuthMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const auth = new AuthMiddleware();


router.get('/formularioequip', auth.validar, ctrl.formularioEquipView);
router.post('/api/equipamentos', auth.validar, ctrl.cadastrarEquipamento);
router.post('/api/equipamentos/excluir', auth.validar, ctrl.excluirEquipamento);
router.get('/formularioequip/:id', auth.validar, ctrl.editarEquipView);
router.post('/api/equipamentos/atualizar', auth.validar, ctrl.atualizarEquipamento);
router.get('/equip/list_json', ctrl.listJsonEquipamentos);

module.exports = router;
