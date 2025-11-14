const Database = require('../db/database');
const db = new Database();
const ejs = require('ejs');
const path = require('path');
class GereController {

    equipamentoView(req, res){
        const sql = 'SELECT * FROM equipamento';
        db.ExecutaComando(sql, [])
          .then(equipamentos => {
              ejs.renderFile(
                  path.join(__dirname, '../Views/gerenciamento/equipamentos.ejs'),
                  { equipamentos },
                  (err, body) => {
                      if (err) return res.status(500).send('Erro ao renderizar');
                      res.render('login/layout', { body, active: 'equipamentos' });
                  }
              );
          })
          .catch(err => res.status(500).send('Erro ao buscar equipamentos'));
    }

    marcaView(req, res){
        const sql = 'SELECT * FROM marca';
        db.ExecutaComando(sql, [])
          .then(marcas => {
              ejs.renderFile(
                  path.join(__dirname, '../Views/gerenciamento/marcas.ejs'),
                  { marcas },
                  (err, body) => {
                      if (err) return res.status(500).send('Erro ao renderizar');
                      res.render('login/layout', { body, active: 'marcas' });
                  }
              );
          })
          .catch(err => res.status(500).send('Erro ao buscar marcas'));
    }

    servicosView(req, res){
        const sql = 'SELECT * FROM servico';
        db.ExecutaComando(sql, [])
          .then(servicos => {
              ejs.renderFile(
                  path.join(__dirname, '../Views/gerenciamento/servicos.ejs'),
                  { servicos },
                  (err, body) => {
                      if (err) return res.status(500).send('Erro ao renderizar');
                      res.render('login/layout', { body, active: 'servicos' });
                  }
              );
          })
          .catch(err => res.status(500).send('Erro ao buscar serviços'));
    }

 


}

module.exports = new GereController();
