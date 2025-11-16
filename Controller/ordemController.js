const OrdemModel = require('../Models/ordemModel');
const ServicoModel = require('../Models/servicoModel');
const EquipamentoModel = require('../Models/equipamentoModel');
const ordemModel = new OrdemModel();
const servicoModel = new ServicoModel();
const equipamentoModel = new EquipamentoModel();
const MarcaModel = require('../Models/marcaModel');
const marcaModel = new MarcaModel();
const ejs = require('ejs');
const path = require('path');

class OrdemController {
    // vista da area de gerenciamento (auth) - renderiza dentro do layout do painel
    async ordensView(req, res) {
        try {
            const ordens = await ordemModel.listAll();
            const servicos = await servicoModel.listAll();
            const equipamento = await equipamentoModel.listAll();
            ejs.renderFile(
                path.join(__dirname, '../Views/gerenciamento/ordens.ejs'),
                { ordens, servicos, equipamento },
                (err, body) => {
                    if (err) {
                        console.error('Erro ao renderizar ordens.ejs', err);
                        return res.status(500).send('Erro ao renderizar ordens');
                    }
                    res.render('login/layout', { body, active: 'ordens' });
                }
            );
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao abrir ordens');
        }
    }

    // view de relatórios - renderiza dentro do layout
    async relatoriosView(req, res) {
        try {
            // opcional: enviar lista de serviços para filtro
            const servicos = await servicoModel.listAll();
            const marcas = await marcaModel.listAll();
            const clientesRows = await ordemModel.listClientesDistinct();
            // converter rows em array simples de nomes
            const clientes = (clientesRows || []).map(r => r.cliente);
            ejs.renderFile(
                path.join(__dirname, '../Views/gerenciamento/relatorios.ejs'),
                { servicos, marcas, clientes },
                (err, body) => {
                    if (err) {
                        console.error('Erro ao renderizar relatorios.ejs', err);
                        return res.status(500).send('Erro ao renderizar relatorios');
                    }
                    res.render('login/layout', { body, active: 'relatorios' });
                }
            );
        } catch (err) {
            console.error(err);
            res.status(500).send('Erro ao abrir relatórios');
        }
    }

    // API pública: criar ordem (abertura) - usado pelo modal público
    async abrirOrdemPublica(req, res) {
        try {
            const { servico_id, cliente, descricao, equipamento_id } = req.body;
            console.log('Recebido:', { servico_id, cliente, descricao, equipamento_id });
            
            const data_abertura = new Date();
            const id = await ordemModel.create({ servico_id, cliente, descricao, data_abertura, equipamento_id });
            
            console.log('Ordem criada com ID:', id);
            res.json({ ok: true, id });
        } catch (err) {
            console.error('Erro ao abrir ordem:', err);
            res.json({ ok: false, msg: 'Erro ao abrir ordem: ' + err.message });
        }
    }

    // API para conclusão (auth)
    async concluirOrdem(req, res) {
        try {
            const { id } = req.body;
            if (!id) return res.json({ ok: false, msg: 'ID não fornecido' });
            const ok = await ordemModel.conclude(id, new Date());
            res.json({ ok: !!ok, msg: ok ? 'Ordem concluída' : 'Erro ao concluir' });
        } catch (err) {
            console.error(err);
            res.json({ ok: false, msg: 'Erro ao concluir ordem' });
        }
    }

    // API lista JSON (auth) - para gerenciador
    async listJson(req, res) {
        try {
            const ordens = await ordemModel.listAll();
            res.json(ordens);
        } catch (err) {
            console.error(err);
            res.status(500).json([]);
        }
    }

    // relatório por período (JSON)
    async relatorioPorPeriodo(req, res) {
        try {
            const { start, end } = req.query;
            const ordens = await ordemModel.listByPeriod(start, end);
            res.json({ ok: true, ordens });
        } catch (err) {
            console.error(err);
            res.json({ ok: false, ordens: [] });
        }
    }

    // relatório por cliente (JSON)
    async relatorioPorCliente(req, res) {
        try {
            const cliente = req.query.cliente || '';
            const ordens = await ordemModel.listByCliente(cliente);
            res.json({ ok: true, ordens });
        } catch (err) {
            console.error(err);
            res.json({ ok: false, ordens: [] });
        }
    }

    // relatório por serviço (JSON)
    async relatorioPorServico(req, res) {
        try {
            const servicoId = req.query.servico_id;
            const ordens = await ordemModel.listByServico(servicoId);
            res.json({ ok: true, ordens });
        } catch (err) {
            console.error(err);
            res.json({ ok: false, ordens: [] });
        }
    }

    // relatório por status (aberto/concluido) - JSON
    async relatorioPorStatus(req, res) {
        try {
            const status = req.query.status; // 'aberta' ou 'concluida'
            if (!status || !['aberta', 'concluida'].includes(status)) {
                return res.json({ ok: false, msg: 'Status inválido', ordens: [] });
            }
            const ordens = await ordemModel.listByStatus(status);
            res.json({ ok: true, ordens });
        } catch (err) {
            console.error(err);
            res.json({ ok: false, ordens: [] });
        }
    }

    // relatório por marca - JSON
    async relatorioPorMarca(req, res) {
        try {
            const marca = req.query.marca;
            if (!marca) {
                return res.json({ ok: false, msg: 'Marca não fornecida', ordens: [] });
            }
            const ordens = await ordemModel.listByMarca(marca);
            res.json({ ok: true, ordens });
        } catch (err) {
            console.error(err);
            res.json({ ok: false, ordens: [] });
        }
    }

    // Gera PDF do relatório (parâmetros via query: type=periodo|cliente|servico|status|marca)
    async relatorioPdf(req, res) {
        try {
            const puppeteer = require('puppeteer');
            const { type } = req.query;
            let ordens = [];
            if (type === 'periodo') {
                const { start, end } = req.query;
                ordens = await ordemModel.listByPeriod(start, end);
            } else if (type === 'cliente') {
                const cliente = req.query.cliente || '';
                ordens = await ordemModel.listByCliente(cliente);
            } else if (type === 'servico') {
                const servicoId = req.query.servico_id;
                ordens = await ordemModel.listByServico(servicoId);
            } else if (type === 'status') {
                const status = req.query.status || 'aberta';
                ordens = await ordemModel.listByStatus(status);
            } else if (type === 'marca') {
                const marca = req.query.marca;
                ordens = await ordemModel.listByMarca(marca);
            } else {
                ordens = await ordemModel.listAll();
            }

            // Gerar HTML simples para PDF
            let html = `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>Relatório de Ordens</title>
<style>
body { font-family: Arial, Helvetica, sans-serif; padding: 20px; font-size:12px; }
h1 { text-align:center; }
table { width:100%; border-collapse: collapse; margin-top:10px; }
th, td { border:1px solid #ccc; padding:6px; text-align:left; }
th { background:#f0f0f0; }
</style>
</head>
<body>
<h1>Relatório de Ordens de Serviço</h1>
<table>
<thead><tr><th>ID</th><th>Serviço</th><th>Cliente</th><th>Equipamento</th><th>Data Abertura</th><th>Data Conclusão</th><th>Status</th></tr></thead>
<tbody>`;
            for (let o of ordens) {
                const da = o.data_abertura ? new Date(o.data_abertura).toLocaleString('pt-BR') : '';
                const dc = o.data_conclusao ? new Date(o.data_conclusao).toLocaleString('pt-BR') : '';
                const equip = o.equipamento_nome ? `${o.equipamento_nome} (${o.marca || 'N/A'})` : 'Sem equipamento';
                html += `<tr><td>${o.id || ''}</td><td>${o.servico_nome||''}</td><td>${o.cliente||''}</td><td>${equip}</td><td>${da}</td><td>${dc}</td><td>${o.status||''}</td></tr>`;
            }
            html += `</tbody></table></body></html>`;

            // Launch puppeteer and generate PDF
            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'networkidle0' });
            const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '20px', bottom: '20px', left: '15px', right: '15px' } });
            await browser.close();

            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="relatorio_ordens.pdf"',
                'Content-Length': pdfBuffer.length
            });
            return res.send(pdfBuffer);
        } catch (err) {
            console.error('Erro gerar PDF:', err);
            res.status(500).send('Erro ao gerar PDF');
        }
    }

}

module.exports = new OrdemController();
