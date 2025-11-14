const express = require('express');
const HomeController = require('../Controller/homeController');    
const homeRouter = express.Router();

let ctrl = new HomeController();

homeRouter.get('/',ctrl.homeView.bind(ctrl)); //index
homeRouter.get('/sobre',ctrl.sobreView.bind(ctrl)); //about
homeRouter.get('/servico',ctrl.servicoView.bind(ctrl)); //services
homeRouter.get('/depoimento',ctrl.depoimentoView.bind(ctrl)); //testimonials
homeRouter.get('/contato', ctrl.contatoView.bind(ctrl)); //contact



const ServicoModel = require('../Models/servicoModel');
const servicoModel = new ServicoModel();

// rota pública que retorna lista de serviços em JSON (usada pelo site público)
homeRouter.get('/servicos/list_json', async (req, res) => {
  try {
    const lista = await servicoModel.listAll();
    res.json(lista);
  } catch (err) {
    console.error('Erro list_json:', err);
    res.status(500).json([]);
  }
});

module.exports = homeRouter;