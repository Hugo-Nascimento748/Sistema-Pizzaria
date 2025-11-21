const API_URL = "http://localhost:3000";

const lista = document.getElementById("lista-produtos");
const btnAdd = document.getElementById("btn-add");

// ---------- Carregar produtos ----------
async function carregarProdutos() {
    const res = await fetch(`${API_URL}/produtos`);
    const produtos = await res.json();

    lista.innerHTML = "";

    produtos.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${p.nome}</strong> - R$${p.valor.toFixed(2)} (${p.tipo})
            <button data-id="${p.id}" class="del">Excluir</button>
        `;
        lista.appendChild(li);
    });

    document.querySelectorAll(".del").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            await fetch(`${API_URL}/produtos/${id}`, { method: "DELETE" });
            carregarProdutos();
        });
    });
}

carregarProdutos();

// ---------- Criar produto ----------
btnAdd.addEventListener("click", async () => {
    const nome = document.getElementById("nome").value;
    const valor = Number(document.getElementById("valor").value);
    const tipo = document.getElementById("tipo").value;

    await fetch(`${API_URL}/produtos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, valor, tipo })
    });

    carregarProdutos();
});
