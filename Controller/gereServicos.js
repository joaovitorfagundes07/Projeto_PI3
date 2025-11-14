const ServicoModel = require('../Models/servicoModel');
const servicoModel = new ServicoModel();

class servicoController {
    async formularioServicoView(req, res) {
            try {
                const id = req.params.id || req.query.id;
                if (id) {
                    const servico = await servicoModel.getById(id);
                    return res.render('gerenciamento/formularioservicos', { servico });
                }
                return res.render('gerenciamento/formularioservicos', { servico: null });
            } catch (err) {
                console.error(err);
                return res.status(500).send('Erro ao buscar serviço');
            }
        }

    async cadastrarServico(req, res) {
        try {
            const { nome, descricao } = req.body;
            if (!nome || !descricao) return res.json({ success: false, error: 'Nome e descrição são obrigatórios.' });
            const id = await servicoModel.create({ nome, descricao });
            return res.json({ success: true, id });
        } catch (err) {
            console.error(err);
            return res.json({ success: false, error: err && err.sqlMessage ? err.sqlMessage : err.message });
        }
    }

    async editarServicoView(req, res) {
        try {
            const id = req.params.id;
            const result = await servicoModel.getById(id);
            res.render('gerenciamento/formularioservico', { servico: result });
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao buscar serviço');
        }
    }

    async atualizarServico(req, res) {
        try {
            const { id, nome, descricao } = req.body;
            if(!id || !nome || !descricao) return res.json({success:false,error:'Dados incompletos.'});
            const ok = await servicoModel.update(id, { nome, descricao });
            if (ok) res.json({success:true, message:'Serviço atualizado com sucesso!'});
            else res.json({success:false,error:'Erro ao atualizar serviço.'});
        } catch (err) {
            console.error(err);
            res.json({success:false,error: err && err.sqlMessage ? err.sqlMessage : err.message});
        }
    }

    async excluirServico(req, res) {
            try {
                const id = req.params.id || req.body.id || req.query.id;
            if (!id) return res.json({ ok: false, msg: 'ID do serviço não fornecido.' });
            const ok = await servicoModel.delete(id);
            let msg = ok ? 'Serviço excluido com sucesso.' : 'Erro ao excluir serviço.';
            res.json({ ok, msg });
        } catch (err) {
            console.error(err);
            res.json({ ok: false, msg: 'Erro no servidor ao excluir serviço.' });
        }
    }
}

module.exports = new servicoController();