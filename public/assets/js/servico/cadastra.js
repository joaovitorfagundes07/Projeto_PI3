document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formserv');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const id = document.getElementById('id') ? document.getElementById('id').value : ''; // NOVO
            const nome = document.getElementById('nome').value;
            const descricao = document.getElementById('descricao').value;

            const url = id ? '/servicos/atualizar' : '/servicos/cadastra'; // NOVO

            const resposta = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, nome, descricao })
            });

            const resultado = await resposta.json();
            const msg = document.getElementById('msg');

            if (resultado.success) {
                msg.innerText = id ? 'Serviço atualizado com sucesso!' : 'Serviço cadastrado com sucesso!';
                form.reset();
                if(id) window.location.href = '/servicos'; // volta para a lista após edição
            } else {
                msg.innerText = 'Erro: ' + (resultado.error || resultado.message || '');
            }
        });
    }

    // Botão Editar
    const btnEditarServ = document.querySelectorAll('.btnEditarServ');
    btnEditarServ.forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.dataset.id;
        window.location.href = `/servicos/formularioservicos/${id}`;
    });
  });
  
    // Botão Excluir (mantido)
    const btnExcluir = document.querySelectorAll('.btnExcluir');
    btnExcluir.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            if (!id) return alert('ID de serviço não encontrado.');
            if (confirm('Confirma a exclusão de serviço?')) {
                fetch('/servicos/excluir', {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({ id })
                })
                .then(res => res.json())
                .then(corpo => {
                    alert(corpo.msg);
                    if (corpo.ok) this.closest('tr').remove();
                });
            }
        });
    });
});
