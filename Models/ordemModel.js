const Database = require('../db/database');

class OrdemModel {
    constructor() {
        this.db = new Database();
    }

    create({servico_id, cliente, descricao, data_abertura, status, equipamento_id}) {
        const sql = `INSERT INTO ordemservico (servico_id, equipamento_id, cliente, descricao, data_abertura, status)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        return this.db.ExecutaComandoLastInserted(sql, [servico_id, equipamento_id || null, cliente, descricao, data_abertura, status || 'aberta']);
    }

    conclude(id, data_conclusao) {
        const sql = `UPDATE ordemservico SET status = 'concluida', data_conclusao = ? WHERE id = ?`;
        return this.db.ExecutaComandoNonQuery(sql, [data_conclusao, id]);
    }

    getById(id) {
        return this.db.ExecutaComando('SELECT * FROM ordemservico WHERE id = ?', [id]);
    }

    listAll() {
        return this.db.ExecutaComando('SELECT o.*, s.nome as servico_nome, e.nome as equipamento_nome, e.marca, e.modelo FROM ordemservico o LEFT JOIN servico s ON s.id = o.servico_id LEFT JOIN equipamento e ON e.id = o.equipamento_id ORDER BY o.data_abertura DESC', []);
    }

    listByPeriod(startDate, endDate) {
        return this.db.ExecutaComando('SELECT o.*, s.nome as servico_nome, e.nome as equipamento_nome, e.marca, e.modelo FROM ordemservico o LEFT JOIN servico s ON s.id = o.servico_id LEFT JOIN equipamento e ON e.id = o.equipamento_id WHERE o.data_abertura BETWEEN ? AND ? ORDER BY o.data_abertura DESC', [startDate, endDate]);
    }

    listByCliente(cliente) {
        return this.db.ExecutaComando('SELECT o.*, s.nome as servico_nome, e.nome as equipamento_nome, e.marca, e.modelo FROM ordemservico o LEFT JOIN servico s ON s.id = o.servico_id LEFT JOIN equipamento e ON e.id = o.equipamento_id WHERE o.cliente LIKE ? ORDER BY o.data_abertura DESC', ['%' + cliente + '%']);
    }

    listByServico(servicoId) {
        return this.db.ExecutaComando('SELECT o.*, s.nome as servico_nome, e.nome as equipamento_nome, e.marca, e.modelo FROM ordemservico o LEFT JOIN servico s ON s.id = o.servico_id LEFT JOIN equipamento e ON e.id = o.equipamento_id WHERE o.servico_id = ? ORDER BY o.data_abertura DESC', [servicoId]);
    }
    listByequipamento(equipamentoId) {
        return this.db.ExecutaComando('SELECT o.*, s.nome as servico_nome, e.nome as equipamento_nome, e.marca, e.modelo FROM ordemservico o LEFT JOIN servico s ON s.id = o.servico_id LEFT JOIN equipamento e ON e.id = o.equipamento_id WHERE o.equipamento_id = ? ORDER BY o.data_abertura DESC', [equipamentoId]);
    }

    listByStatus(status) {
        return this.db.ExecutaComando('SELECT o.*, s.nome as servico_nome, e.nome as equipamento_nome, e.marca, e.modelo FROM ordemservico o LEFT JOIN servico s ON s.id = o.servico_id LEFT JOIN equipamento e ON e.id = o.equipamento_id WHERE o.status = ? ORDER BY o.data_abertura DESC', [status]);
    }

    listByMarca(marca) {
        return this.db.ExecutaComando('SELECT o.*, s.nome as servico_nome, e.nome as equipamento_nome, e.marca, e.modelo FROM ordemservico o LEFT JOIN servico s ON s.id = o.servico_id LEFT JOIN equipamento e ON e.id = o.equipamento_id WHERE e.marca = ? ORDER BY o.data_abertura DESC', [marca]);
    }

    // retorna lista de clientes distintos presentes nas ordens
    listClientesDistinct() {
        return this.db.ExecutaComando('SELECT DISTINCT cliente FROM ordemservico WHERE cliente IS NOT NULL AND cliente <> "" ORDER BY cliente', []);
    }
}

module.exports = OrdemModel;


exports.abrirOrdem = (req, res) => {
  ordemModel.criarOrdem(req.body, (err, result) => {
    if (err) return res.status(500).send('Erro ao abrir ordem');
    res.redirect('/ordens');
  });
};

exports.concluirOrdem = (id, callback) => {
  db.query(
    'UPDATE ordemservico SET status="concluida", data_conclusao=NOW() WHERE id=?',
    [id],
    callback
  );
};

