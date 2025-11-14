const Database = require('../db/database');
const EquipamentoModel = require('../Models/equipamentoModel');
const MarcaModel = require('../Models/marcaModel');
const equipamentoModel = new EquipamentoModel();
const marcaModel = new MarcaModel();

class equipamentoController {

    // Formulário de cadastro
    async formularioEquipView(req, res) {
        try {
            const marcas = await marcaModel.listAll();
            res.render('gerenciamento/formularioequip', { marcas, equipamento: null });
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar marcas');
        }
    }

    async cadastrarEquipamento(req, res) {
        try {
            const { nome, marca, modelo, quantidade } = req.body;
            if (!nome || !marca) return res.json({ success: false, message: 'Dados incompletos' });

            const insertedId = await equipamentoModel.create({ nome, marcaId: marca, modelo, quantidade });
            if (insertedId) {
                return res.json({ success: true, message: 'Equipamento cadastrado com sucesso!' });
            } else {
                return res.json({ success: false, message: 'Erro ao inserir no banco' });
            }
        } catch (err) {
            console.error(err);
            return res.json({ success: false, message: 'Erro no servidor' });
        }
    }

    async editarEquipView(req, res) {
        try {
            const id = req.params.id;
            const equipamento = await equipamentoModel.getById(id);
            const marcas = await marcaModel.listAll();
            res.render('gerenciamento/formularioequip', { marcas, equipamento });
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao renderizar');
        }
    }

    async atualizarEquipamento(req, res) {
        try {
            const { id, nome, marca, modelo, quantidade } = req.body;
            if (!id || !nome || !marca) return res.json({ success: false, message: 'Dados incompletos' });

            const ok = await equipamentoModel.update(id, { nome, marcaId: marca, modelo, quantidade });
            if (ok) return res.json({ success: true, message: 'Equipamento atualizado com sucesso!' });
            else return res.json({ success: false, message: 'Erro ao atualizar equipamento.' });
        } catch (err) {
            console.error(err);
            return res.json({ success: false, message: 'Erro no servidor' });
        }
    }

    async excluirEquipamento(req, res) {
        try {
            const id = req.params.id || req.body.id || req.query.id;
                if (!id) return res.json({ ok: false, msg: 'ID do equipamento não fornecido.' });
            const ok = await equipamentoModel.delete(id);
            if (ok) res.json({ ok: true, msg: 'Equipamento excluído com sucesso!' });
            else res.json({ ok: false, msg: 'Equipamento não encontrado ou não pôde ser excluído.' });
        } catch (err) {
            console.error(err);
            res.json({ ok: false, msg: 'Erro no servidor ao excluir equipamento.' });
        }
    }

    // API: listar equipamentos em JSON (público, sem autenticação)
    async listJsonEquipamentos(req, res) {
        try {
            const equipamentos = await equipamentoModel.listAll();
            res.json(equipamentos);
        } catch (err) {
            console.error('Erro ao listar equipamentos:', err);
            res.status(500).json([]);
        }
    }

}

module.exports = new equipamentoController();