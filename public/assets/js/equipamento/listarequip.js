document.addEventListener('DOMContentLoaded', function() {

    // Botão Excluir ---
    const btnExcluir = document.querySelectorAll('.btnExcluir');
    btnExcluir.forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (!id) return alert('ID do equipamento não encontrado');

            if (confirm('Deseja realmente excluir esse equipamento?')) {
                const res = await fetch("/equip/api/equipamentos/excluir", {
                    method: 'POST',
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ id })
                });
                const data = await res.json();
                alert(data.msg);
                if (data.ok) window.location.reload();
            }
        });
    });

    // Botão Editar ---
    const btnEditar = document.querySelectorAll('.btnEditar');
    btnEditar.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            window.location.href = `/equip/formularioequip/${id}`;
        });
    });

    // Cadastro / Atualização ---
    const form = document.getElementById('equipamentoForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('id').value;
            const data = {
                id,
                nome: document.getElementById('nome').value,
                marca: document.getElementById('marca').value,
                modelo: document.getElementById('modelo').value,
                quantidade: document.getElementById('quantidade').value
            };

            const url = id ? '/equip/api/equipamentos/atualizar' : '/equip/api/equipamentos';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            alert(result.message || (result.success ? 'Operação concluída!' : 'Erro.'));
            if (result.success) window.location.href = '/equipamentos';
        });
    }
});
