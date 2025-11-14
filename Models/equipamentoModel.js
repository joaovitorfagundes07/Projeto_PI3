const Database = require('../db/database');

class EquipamentoModel {
    async listAll() {
        const db = new Database();
        return db.ExecutaComando('SELECT * FROM equipamento', []);
    }

    async getById(id) {
        const db = new Database();
        const rows = await db.ExecutaComando('SELECT * FROM equipamento WHERE id = ?', [id]);
        return rows && rows.length ? rows[0] : null;
    }

    async create({ nome, marcaId, modelo, quantidade }) {
        const db = new Database();
        // get marca nome
        const marcas = await db.ExecutaComando('SELECT nome FROM marca WHERE id = ?', [marcaId]);
        const marcaNome = marcas && marcas.length ? marcas[0].nome : null;
        const sqlInsert = 'INSERT INTO equipamento (nome, marca, modelo, quantidade) VALUES (?, ?, ?, ?)';
        const id = await db.ExecutaComandoLastInserted(sqlInsert, [nome, marcaNome, modelo, quantidade]);
        return id;
    }

    async update(id, { nome, marcaId, modelo, quantidade }) {
        const db = new Database();
        const marcas = await db.ExecutaComando('SELECT nome FROM marca WHERE id = ?', [marcaId]);
        const marcaNome = marcas && marcas.length ? marcas[0].nome : null;
        const sqlUpdate = `UPDATE equipamento SET nome = ?, marca = ?, modelo = ?, quantidade = ? WHERE id = ?`;
        const ok = await db.ExecutaComandoNonQuery(sqlUpdate, [nome, marcaNome, modelo, quantidade, id]);
        return ok;
    }

    async delete(id) {
        const db = new Database();
        return db.ExecutaComandoNonQuery('DELETE FROM equipamento WHERE id = ?', [id]);
    }
}

module.exports = EquipamentoModel;