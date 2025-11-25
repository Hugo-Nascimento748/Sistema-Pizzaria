const API_URL = "http://localhost:3000";

let clienteLogado = JSON.parse(localStorage.getItem("cliente")) || null;
let carrinho = [];

if (clienteLogado) { mostrarLoja(); }

// --- LOGIN & CADASTRO ---
window.mudarAba = function(aba) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('form-login').style.display = aba === 'login' ? 'block' : 'none';
    document.getElementById('form-cadastro').style.display = aba === 'cadastro' ? 'block' : 'none';
}

document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const telefone = document.getElementById("telefone-login").value.trim();
    if(!telefone) return alert("Digite seu telefone.");

    try {
        const res = await fetch(`${API_URL}/clientes/login`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telefone })
        });
        if (res.ok) { salvarLogin((await res.json()).cliente); } 
        else { alert("Cliente não encontrado."); mudarAba('cadastro'); }
    } catch (err) { alert("Erro de conexão."); }
});

document.getElementById("btn-cadastrar").addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const telefone = document.getElementById("telefone-cad").value.trim();
    if(!nome || !telefone || !endereco) return alert("Preencha tudo!");

    try {
        const res = await fetch(`${API_URL}/clientes`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, endereco, telefone })
        });
        if(res.ok) {
            const loginRes = await fetch(`${API_URL}/clientes/login`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ telefone })
            });
            salvarLogin((await loginRes.json()).cliente);
        } else { alert("Erro ao cadastrar."); }
    } catch(e) { alert("Erro de conexão."); }
});

function salvarLogin(cliente) {
    clienteLogado = cliente;
    localStorage.setItem("cliente", JSON.stringify(cliente));
    mostrarLoja();
}
document.getElementById("btn-sair").addEventListener("click", () => {
    localStorage.removeItem("cliente"); location.reload();
});

function mostrarLoja() {
    document.getElementById("login-cadastro").style.display = "none";
    document.getElementById("header-app").style.display = "block";
    document.getElementById("area-produtos").style.display = "block";
    document.getElementById("nome-cliente").innerText = "Olá, " + clienteLogado.nome.split(' ')[0];
    carregarProdutos();
}

// --- PRODUTOS ---
function getImagemPorCategoria(categoria) {
    const imagens = {
        'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=60',
        'Bebida': 'https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&w=500&q=60',
        'Sobremesa': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=500&q=60',
        'Padrao': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=60'
    };
    return imagens[categoria] || imagens['Padrao'];
}

async function carregarProdutos() {
    try {
        const res = await fetch(`${API_URL}/produtos`);
        const produtos = await res.json();
        const lista = document.getElementById("lista-produtos");
        lista.innerHTML = "";

        produtos.forEach(p => {
            const div = document.createElement("div");
            div.className = "produto";
            div.dataset.categoria = p.tipo;
            div.innerHTML = `
                <img src="${getImagemPorCategoria(p.tipo)}" alt="${p.nome}" class="produto-img">
                <div class="produto-info">
                    <div><h4>${p.nome}</h4><p class="produto-preco">R$ ${Number(p.valor).toFixed(2)}</p></div>
                    <div class="controles-add">
                        <input type="number" value="1" min="1" id="qtd-${p.id}">
                        <button class="btn-add" onclick="addCarrinho(${p.id}, '${p.nome}', ${p.valor})">+</button>
                    </div>
                </div>`;
            lista.appendChild(div);
        });
        configurarFiltros();
    } catch (err) { console.error(err); }
}

function configurarFiltros() {
    document.querySelectorAll(".filtro").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".filtro").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            const cat = e.target.dataset.categoria;
            document.querySelectorAll(".produto").forEach(prod => {
                prod.style.display = (cat === "Todas" || prod.dataset.categoria === cat) ? "flex" : "none";
            });
        });
    });
}

// --- CARRINHO ---
window.addCarrinho = function(id, nome, valor) {
    const qtd = Number(document.getElementById(`qtd-${id}`).value);
    if (qtd < 1) return;
    const item = carrinho.find(i => i.id === id);
    if(item) item.quantidade += qtd; else carrinho.push({ id, nome, valor, quantidade: qtd });
    document.getElementById(`qtd-${id}`).value = 1;
    atualizarBarra();
}

function atualizarBarra() {
    const total = carrinho.reduce((acc, i) => acc + (i.valor * i.quantidade), 0);
    const qtd = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
    document.getElementById("qtd-carrinho").innerText = qtd;
    document.getElementById("total-barra").innerText = "R$ " + total.toFixed(2);
    document.getElementById("barra-carrinho").style.display = qtd > 0 ? "flex" : "none";
}

// --- MODAL ---
window.abrirModalCarrinho = function() {
    const lista = document.getElementById("itens-carrinho");
    lista.innerHTML = "";
    let total = 0;
    carrinho.forEach((item, idx) => {
        total += item.valor * item.quantidade;
        lista.innerHTML += `<li><span><b>${item.quantidade}x</b> ${item.nome}</span>
        <div style="display:flex;align-items:center;gap:10px;"><span>R$ ${(item.valor * item.quantidade).toFixed(2)}</span>
        <button onclick="removerItem(${idx})" style="color:red;border:none;background:none;font-weight:bold;">X</button></div></li>`;
    });
    document.getElementById("total-modal").innerText = total.toFixed(2);
    document.getElementById("modal-carrinho").style.display = "block";
}
window.fecharModalCarrinho = () => document.getElementById("modal-carrinho").style.display = "none";
window.removerItem = (idx) => { carrinho.splice(idx, 1); atualizarBarra(); abrirModalCarrinho(); if(carrinho.length===0) fecharModalCarrinho(); };

// --- FINALIZAR PEDIDO (CORRIGIDO) ---
document.getElementById("btn-finalizar").addEventListener("click", async () => {
    if(carrinho.length === 0) return alert("Carrinho vazio!");

    // CORREÇÃO: Pega o valor exato selecionado (Pix, Cartão, etc)
    const selectPagamento = document.getElementById("forma-pagamento");
    const pagamentoEscolhido = selectPagamento.options[selectPagamento.selectedIndex].value;

    console.log("Pagamento selecionado:", pagamentoEscolhido); // Debug

    if(!confirm(`Confirmar pedido? Pagamento: ${pagamentoEscolhido}`)) return;

    const payload = {
        clienteId: Number(clienteLogado.id),
        formaPagamento: pagamentoEscolhido, // Envia o texto exato para o servidor
        produtos: carrinho.map(i => ({ id: Number(i.id), quantidade: Number(i.quantidade) }))
    };

    try {
        const res = await fetch(`${API_URL}/pedidos`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            alert("Pedido enviado com sucesso!");
            carrinho = []; atualizarBarra(); fecharModalCarrinho();
        } else { alert("Erro ao enviar pedido."); }
    } catch(e) { alert("Erro de conexão."); }
});