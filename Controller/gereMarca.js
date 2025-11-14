const MarcaModel = require('../Models/marcaModel');
const marcaModel = new MarcaModel();

class marcaController {
    async formularioMarcaView(req, res) {
            try {
                const id = req.params.id || req.query.id;
                if (id) {
                    const marca = await marcaModel.getById(id);
                    return res.render('gerenciamento/formulariomarca', { marca });
                }
                return res.render('gerenciamento/formulariomarca', { marca: null });
            } catch (err) {
                console.error(err);
                return res.status(500).send('Erro ao buscar marca');
            }
        }

    async cadastrarMarca(req, res) {
        try {
            const { nome, tipo } = req.body;
            if (!nome || !tipo) return res.json({ success: false, error: 'Nome e tipo são obrigatórios.' });
            const id = await marcaModel.create({ nome, tipo });
            return res.json({ success: true, id });
        } catch (err) {
            console.error(err);
            return res.json({ success: false, error: err && err.sqlMessage ? err.sqlMessage : err.message });
        }
    }

    async editarMarcaView(req, res) {
        try {
            const id = req.params.id;
            const result = await marcaModel.getById(id);
            res.render('gerenciamento/formulariomarca', { marca: result });
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar marca');
        }
    }

    async atualizarMarca(req, res) {
        try {
            const { id, nome, tipo } = req.body;
            if (!id || !nome || !tipo) return res.json({ success: false, error: 'Dados incompletos.' });
            const ok = await marcaModel.update(id, { nome, tipo });
            if (ok) res.json({ success: true, message: 'Marca atualizada com sucesso!' });
            else res.json({ success: false, error: 'Erro ao atualizar marca.' });
        } catch (err) {
            console.error(err);
            res.json({ success: false, error: err && err.sqlMessage ? err.sqlMessage : err.message });
        }
    }

    async excluirMarca(req, res) {
            try {
                const id = req.params.id || req.body.id || req.query.id;
            if (!id) return res.json({ ok: false, msg: 'ID da marca não fornecido.' });
            const ok = await marcaModel.delete(id);
            let msg = ok ? 'Marca excluída com sucesso.' : 'Erro ao excluir marca.';
            res.json({ ok, msg });
        } catch (err) {
            console.error(err);
            res.json({ ok: false, msg: 'Erro no servidor ao excluir marca.' });
        }
    }
}

module.exports = new marcaController();