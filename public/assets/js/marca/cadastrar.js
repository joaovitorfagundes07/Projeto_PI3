document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formMarca');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const id = document.getElementById('id').value; // NOVO: para edição
            const nome = document.getElementById('nome').value;
            const tipo = document.getElementById('tipo').value;

            const url = id ? '/marca/atualizar' : '/marca/cadastrar'; // NOVO: decide rota

            const resposta = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, nome, tipo })
            });

            const resultado = await resposta.json();
            const msg = document.getElementById('msg');

            if (resultado.success) {
                msg.innerText = id ? 'Marca atualizada com sucesso!' : 'Marca cadastrada com sucesso!';
                form.reset();
                if(id) window.location.href = '/marcas'; // volta para a lista após edição
            } else {
                msg.innerText = 'Erro: ' + (resultado.error || resultado.message || '');
            }
        });
    }

    // Botão Editar
    const btnEditarMarca = document.querySelectorAll('.btnEditarMarca');
    btnEditarMarca.forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.dataset.id;
        window.location.href = `/marca/formulariomarca/${id}`;
    });
    });


    // Botão Excluir (mantido)
    const btnExcluir = document.querySelectorAll('.btnExcluir');
    btnExcluir.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            if (!id) return alert('ID da marca não encontrado.');
            if (confirm('Confirma a exclusão de marca?')) {
                fetch('/marca/excluir', {
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
