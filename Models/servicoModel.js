const Database = require('../db/database');

class ServicoModel {
    async listAll() {
        const db = new Database();
        return db.ExecutaComando('SELECT * FROM servico', []);
    }

    async getById(id) {
        const db = new Database();
        const rows = await db.ExecutaComando('SELECT * FROM servico WHERE id = ?', [id]);
        return rows && rows.length ? rows[0] : null;
    }

    async create({ nome, descricao }) {
        const db = new Database();
        return db.ExecutaComandoLastInserted('INSERT INTO servico (nome, descricao) VALUES (?, ?)', [nome, descricao]);
    }

    async update(id, { nome, descricao }) {
        const db = new Database();
        return db.ExecutaComandoNonQuery('UPDATE servico SET nome = ?, descricao = ? WHERE id = ?', [nome, descricao, id]);
    }

    async delete(id) {
        const db = new Database();
        return db.ExecutaComandoNonQuery('DELETE FROM servico WHERE id = ?', [id]);
    }
}

module.exports = ServicoModel;