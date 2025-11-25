const API_URL = "http://localhost:3000";

if (!localStorage.getItem("auth")) { window.location.href = "login.html"; }
document.getElementById("btn-sair").addEventListener("click", () => {
    localStorage.removeItem("auth"); window.location.href = "login.html";
});

function mudarTela(telaId) {
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('ativa'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tela-' + telaId).classList.add('ativa');
    
    if(telaId === 'pedidos') { document.querySelectorAll('.nav-btn')[0].classList.add('active'); carregarPedidos(); }
    if(telaId === 'produtos') { document.querySelectorAll('.nav-btn')[1].classList.add('active'); carregarProdutos(); }
    if(telaId === 'vendas') { document.querySelectorAll('.nav-btn')[2].classList.add('active'); carregarVendas(); }
}

// --- PEDIDOS (MOSTRANDO PAGAMENTO CORRETAMENTE) ---
async function carregarPedidos() {
    try {
        const res = await fetch(`${API_URL}/pedidos`);
        const pedidos = await res.json();
        const lista = document.getElementById("lista-pedidos");
        lista.innerHTML = "";
        
        if (pedidos.length === 0) return lista.innerHTML = "<p style='color:#777; text-align:center; width:100%'>Nenhum pedido pendente.</p>";

        pedidos.forEach(p => {
            const card = document.createElement("div");
            card.className = "card-pedido";
            
            // ÍCONES DE PAGAMENTO
            let icone = "💵";
            let txtPagamento = p.formaPagamento || "Dinheiro"; // Usa o que veio do banco ou Dinheiro se nulo
            
            if(txtPagamento.includes("Pix")) icone = "💠";
            if(txtPagamento.includes("Cartão")) icone = "💳";

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between;">
                    <h3>#${p.id}</h3>
                    <span style="background:#333; padding:2px 8px; border-radius:4px; font-size:0.85em;">${icone} ${txtPagamento}</span>
                </div>
                <div>👤 ${p.cliente.nome}</div>
                <div style="font-size:0.9em; color:#aaa;">🕒 ${new Date(p.data).toLocaleTimeString()}</div>
                <div style="font-weight:bold; color:#27ae60; margin:10px 0;">R$ ${p.valorTotal.toFixed(2)}</div>
                <div class="acoes-pedido">
                    <button class="btn-detalhes" onclick="abrirDetalhes(${p.id})">Ver Itens</button>
                    <button class="btn-concluir" onclick="concluirPedido(${p.id})">✅ Pronto</button>
                </div>`;
            lista.appendChild(card);
        });
    } catch (e) { console.error(e); }
}

async function concluirPedido(id) {
    if(!confirm("Finalizar pedido?")) return;
    await fetch(`${API_URL}/pedidos/${id}`, { method: "DELETE" });
    carregarPedidos();
}

// --- PRODUTOS ---
async function carregarProdutos() {
    const res = await fetch(`${API_URL}/produtos`);
    const produtos = await res.json();
    const lista = document.getElementById("lista-produtos");
    lista.innerHTML = "";
    produtos.forEach(p => {
        lista.innerHTML += `<div><span><strong>${p.nome}</strong> - R$ ${p.valor} (${p.tipo})</span>
        <div><button class="btn-edit" onclick="editarProduto(${p.id}, '${p.nome}', ${p.valor}, '${p.tipo}')">✏️</button>
        <button class="btn-del" onclick="deletarProduto(${p.id})">🗑️</button></div></div>`;
    });
}
document.getElementById("form-produto").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("prod-id").value;
    const nome = document.getElementById("prod-nome").value;
    const valor = document.getElementById("prod-valor").value;
    const tipo = document.getElementById("prod-tipo").value;
    const url = id ? `${API_URL}/produtos/${id}` : `${API_URL}/produtos`;
    const method = id ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome, valor: Number(valor), tipo }) });
    limparFormProduto(); carregarProdutos();
});
function editarProduto(id, nome, valor, tipo) {
    document.getElementById("prod-id").value = id;
    document.getElementById("prod-nome").value = nome;
    document.getElementById("prod-valor").value = valor;
    document.getElementById("prod-tipo").value = tipo;
}
function limparFormProduto() { document.getElementById("form-produto").reset(); document.getElementById("prod-id").value = ""; }
async function deletarProduto(id) { if(confirm("Excluir?")) { await fetch(`${API_URL}/produtos/${id}`, { method: "DELETE" }); carregarProdutos(); } }

// --- VENDAS (FILTROS + TOTAL GERAL) ---
async function carregarVendas() {
    const res = await fetch(`${API_URL}/vendas`);
    let vendas = await res.json();
    
    const filtroDia = document.getElementById("filtro-dia").value;
    const filtroMes = document.getElementById("filtro-mes").value;
    const labelTotal = document.getElementById("label-total");

    // LÓGICA DE FILTRAGEM
    if (filtroDia) {
        vendas = vendas.filter(v => v.data.startsWith(filtroDia));
        labelTotal.innerText = `TOTAL DO DIA (${new Date(filtroDia).toLocaleDateString()})`;
    } else if (filtroMes) {
        vendas = vendas.filter(v => v.data.startsWith(filtroMes));
        labelTotal.innerText = `TOTAL DO MÊS (${filtroMes})`;
    } else {
        labelTotal.innerText = "TOTAL GERAL (TODO O PERÍODO)";
    }

    const tbody = document.getElementById("tabela-vendas-body");
    tbody.innerHTML = "";
    let total = 0;
    
    // Inverter ordem (mais recente primeiro)
    vendas.reverse();

    if(vendas.length === 0) tbody.innerHTML = "<tr><td colspan='4' style='text-align:center'>Nenhum registro encontrado.</td></tr>";

    vendas.forEach(v => {
        total += Number(v.valor);
        tbody.innerHTML += `<tr><td>#${v.id}</td><td>${new Date(v.data).toLocaleString()}</td>
        <td>${v.formaPagamento || 'Dinheiro'}</td><td>R$ ${Number(v.valor).toFixed(2)}</td></tr>`;
    });
    document.getElementById("total-vendas").innerText = "R$ " + total.toFixed(2);
}

// NOVA FUNÇÃO: VER TOTAL GERAL
function verTotalGeral() {
    document.getElementById("filtro-dia").value = "";
    document.getElementById("filtro-mes").value = "";
    carregarVendas();
}

function limparFiltros() {
    document.getElementById("filtro-dia").value = "";
    document.getElementById("filtro-mes").value = "";
    carregarVendas();
}

// --- MODAL ---
const modal = document.getElementById("modal");
function fecharModal() { modal.style.display = "none"; }
async function abrirDetalhes(id) {
    const res = await fetch(`${API_URL}/pedidos/${id}`);
    const p = await res.json();
    document.getElementById("modal-titulo").innerText = "Pedido #" + p.id;
    document.getElementById("modal-cliente").innerHTML = `<p>${p.cliente.nome}<br>${p.cliente.endereco}</p>`;
    document.getElementById("modal-itens").innerHTML = p.produtos.map(pr => `<li>${pr.quantidade}x ${pr.nome}</li>`).join('');
    document.getElementById("modal-total").innerText = "Total: R$ " + p.valorTotal.toFixed(2);
    modal.style.display = "block";
}

carregarPedidos();