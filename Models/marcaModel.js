const Database = require('../db/database');

class MarcaModel {
    async listAll() {
        const db = new Database();
        return db.ExecutaComando('SELECT * FROM marca', []);
    }

    async getById(id) {
        const db = new Database();
        const rows = await db.ExecutaComando('SELECT * FROM marca WHERE id = ?', [id]);
        return rows && rows.length ? rows[0] : null;
    }

    async create({ nome, tipo }) {
        const db = new Database();
        return db.ExecutaComandoLastInserted('INSERT INTO marca (nome, tipo) VALUES (?, ?)', [nome, tipo]);
    }

    async update(id, { nome, tipo }) {
        const db = new Database();
        return db.ExecutaComandoNonQuery('UPDATE marca SET nome = ?, tipo = ? WHERE id = ?', [nome, tipo, id]);
    }

    async delete(id) {
        const db = new Database();
        return db.ExecutaComandoNonQuery('DELETE FROM marca WHERE id = ?', [id]);
    }
}

module.exports = MarcaModel;