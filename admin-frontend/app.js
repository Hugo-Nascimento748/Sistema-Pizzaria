const API_URL = "http://localhost:3000";

// Proteção: Se não tiver login, manda voltar
if (!localStorage.getItem("auth")) {
    window.location.href = "login.html";
}

// --- ELEMENTOS DO DOM ---
const listaPedidos = document.getElementById("lista-pedidos");
const modal = document.getElementById("modal-detalhes");
const spanClose = document.getElementsByClassName("close")[0];
const btnFechar = document.getElementById("btn-fechar-modal");

// --- CONFIGURAÇÃO DO MODAL ---
if (spanClose) spanClose.onclick = () => modal.style.display = "none";
if (btnFechar) btnFechar.onclick = () => modal.style.display = "none";
// Fecha se clicar fora da janela
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }

// --- BOTÕES DO MENU E AÇÕES ---
const btnTeste = document.getElementById("btn-teste");
if (btnTeste) {
    btnTeste.addEventListener("click", async () => {
        const res = await fetch(`${API_URL}/debug/seed`, { method: "POST" });
        if(res.ok) { alert("Pedido Criado!"); carregarPedidos(); }
        else alert("Erro ao criar pedido de teste");
    });
}

document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("auth");
    window.location.href = "login.html";
});

// Alternar Abas
document.getElementById("btn-produtos").addEventListener("click", () => {
    document.getElementById("secao-pedidos").style.display = "none";
    document.getElementById("secao-produtos").style.display = "block";
    carregarProdutos();
});
document.getElementById("btn-pedidos").addEventListener("click", () => {
    document.getElementById("secao-produtos").style.display = "none";
    document.getElementById("secao-pedidos").style.display = "block";
    carregarPedidos();
});


// ============================================================
// 1. LISTAGEM DE PEDIDOS (Tela Principal)
// ============================================================
async function carregarPedidos() {
    try {
        const res = await fetch(`${API_URL}/pedidos`);
        const pedidos = await res.json();

        listaPedidos.innerHTML = "";

        if (pedidos.length === 0) {
            listaPedidos.innerHTML = "<p style='color:#ccc; padding:10px;'>Nenhum pedido encontrado.</p>";
            return;
        }

        pedidos.forEach(p => {
            const li = document.createElement("li");
            li.className = "pedido-card";
            // Estilo Inline para garantir visual
            li.style.cssText = "border: 1px solid #444; padding: 15px; margin: 10px 0; display: flex; justify-content: space-between; background: #222; color: white; border-radius: 8px;";

            li.innerHTML = `
                <div>
                    <strong style="font-size:1.2em; color: #ff4d4d;">Pedido #${p.id}</strong>
                    <br>Cliente: ${p.cliente.nome}
                    <br><small style="color:#aaa">${new Date(p.data).toLocaleString()}</small>
                </div>
                <div style="text-align:right">
                    <div style="font-weight:bold; color:#4CAF50; margin-bottom: 10px;">R$ ${p.valorTotal.toFixed(2)}</div>
                    
                    <button class="btn-detalhes" data-id="${p.id}" 
                        style="background:blue; color:white; border:none; padding:6px 12px; cursor:pointer; border-radius:4px; margin-right:5px;">
                        Ver Detalhes
                    </button>
                    
                    <button class="btn-remover" data-id="${p.id}" 
                        style="background:red; color:white; border:none; padding:6px 12px; cursor:pointer; border-radius:4px;">
                        X
                    </button>
                </div>
            `;
            listaPedidos.appendChild(li);
        });
    } catch (err) {
        console.error("Erro ao listar pedidos:", err);
        listaPedidos.innerHTML = "<p style='color:red'>Erro de conexão com o servidor.</p>";
    }
}

// ============================================================
// 2. AÇÕES DE CLIQUE (Delegação de Eventos)
// ============================================================
listaPedidos.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    // Botão Remover
    if (e.target.classList.contains("btn-remover")) {
        if (confirm(`Tem certeza que deseja excluir o Pedido #${id}?`)) {
            try {
                await fetch(`${API_URL}/pedidos/${id}`, {
                    method: "DELETE",
                    headers: { usuario: "admin", senha: "1234" }
                });
                carregarPedidos(); // Atualiza a lista
            } catch (err) { alert("Erro ao remover."); }
        }
    }

    // Botão Detalhes
    if (e.target.classList.contains("btn-detalhes")) {
        abrirDetalhes(id);
    }
});


// ============================================================
// 3. FUNÇÃO DO MODAL (Detalhes do Pedido)
// ============================================================
async function abrirDetalhes(id) {
    try {
        console.log("Buscando detalhes do ID:", id);
        
        const res = await fetch(`${API_URL}/pedidos/${id}`);
        if (!res.ok) {
            alert("Erro ao buscar dados do pedido.");
            return;
        }
        
        const p = await res.json();
        console.log("Dados recebidos:", p);

        // --- PREENCHENDO O MODAL ---
        
        // Cabeçalho e Totais
        document.getElementById("modal-id").innerText = "#" + (p.id || "0");
        document.getElementById("modal-total").innerText = "R$ " + (p.valorTotal ? p.valorTotal.toFixed(2) : "0.00");

        // Informações do Cliente (Com proteção contra nulos)
        const cliente = p.cliente || {};
        document.getElementById("modal-info-cliente").innerHTML = `
            <p><strong>Cliente:</strong> ${cliente.nome || "Não informado"}</p>
            <p><strong>Telefone:</strong> ${cliente.telefone || "Não informado"}</p>
            <p><strong>Endereço:</strong> ${cliente.endereco || "Não informado"}</p>
        `;

        // Lista de Itens
        const ulItens = document.getElementById("modal-lista-itens");
        ulItens.innerHTML = "";
        
        if (p.produtos && Array.isArray(p.produtos) && p.produtos.length > 0) {
            p.produtos.forEach(prod => {
                // ATENÇÃO: Aqui usamos 'quantidade' que é o padrão novo do Backend
                const qtd = prod.quantidade || 0;
                const nome = prod.nome || "Produto sem nome";
                const valor = Number(prod.valor || 0);

                const li = document.createElement("li");
                li.style.cssText = "border-bottom: 1px solid #444; padding: 8px 0; display:flex; justify-content:space-between; color: white;";
                
                li.innerHTML = `
                    <span>${qtd}x ${nome}</span>
                    <span>R$ ${(valor * qtd).toFixed(2)}</span>
                `;
                ulItens.appendChild(li);
            });
        } else {
            ulItens.innerHTML = "<p style='color:#aaa; font-style:italic; text-align:center;'>Nenhum item neste pedido.</p>";
        }

        // Exibe o modal
        modal.style.display = "block";

    } catch (err) {
        console.error("Erro no Modal:", err);
        alert("Erro ao abrir a janela de detalhes.");
    }
}


// ============================================================
// 4. FUNÇÕES DE PRODUTOS
// ============================================================
async function carregarProdutos() {
    try {
        const res = await fetch(`${API_URL}/produtos`);
        const produtos = await res.json();
        const lista = document.getElementById("lista-produtos");
        if (lista) {
            lista.innerHTML = "";
            produtos.forEach(p => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${p.nome}</strong> - R$${p.valor} <button class="deletar" data-id="${p.id}">Excluir</button>`;
                lista.appendChild(li);
            });
            
            // Reativar botões de excluir produto
            document.querySelectorAll(".deletar").forEach(btn => {
                btn.addEventListener("click", async (e) => {
                    const id = e.target.dataset.id;
                    await fetch(`${API_URL}/produtos/${id}`, { method: "DELETE", headers: {usuario:"admin", senha:"1234"} });
                    carregarProdutos();
                });
            });
        }
    } catch (err) { console.error(err); }
}

const formProduto = document.getElementById("form-produto");
if (formProduto) {
    formProduto.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        const valor = document.getElementById("valor").value;
        const tipo = document.getElementById("tipo").value;
        
        await fetch(`${API_URL}/produtos`, {
            method: "POST",
            headers: {"Content-Type": "application/json", usuario:"admin", senha:"1234"},
            body: JSON.stringify({ nome, valor: Number(valor), tipo })
        });
        formProduto.reset();
        carregarProdutos();
        alert("Produto adicionado!");
    });
}

// Inicialização
carregarPedidos();