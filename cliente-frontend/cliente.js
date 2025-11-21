const API_URL = "http://localhost:3000";

// --- ELEMENTOS DO DOM ---
const secaoLogin = document.getElementById("login-cadastro");
const secaoProdutos = document.getElementById("area-produtos");
const headerApp = document.getElementById("header-app");
const barraCarrinho = document.getElementById("barra-carrinho");
const modalCarrinho = document.getElementById("modal-carrinho");

// --- ESTADO DA APLICAÇÃO ---
// Tenta recuperar o cliente salvo. Se não tiver, começa como null.
let clienteLogado = JSON.parse(localStorage.getItem("cliente")) || null;
let carrinho = [];

// --- INICIALIZAÇÃO ---
// Se já tiver cliente salvo, pula o login e vai pra loja
if (clienteLogado) {
    mostrarLoja();
}

// ============================================================
// 1. LOGIN E CADASTRO
// ============================================================

// Alternar entre abas de Login e Cadastro
window.mudarAba = function(aba) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    if(aba === 'login') {
        document.getElementById('form-login').style.display = 'block';
        document.getElementById('form-cadastro').style.display = 'none';
    } else {
        document.getElementById('form-login').style.display = 'none';
        document.getElementById('form-cadastro').style.display = 'block';
    }
}

// Função de Login
document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const telefone = document.getElementById("telefone-login").value.trim();
    
    if(!telefone) return alert("Por favor, digite seu telefone.");

    try {
        const res = await fetch(`${API_URL}/clientes/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telefone })
        });

        if (res.ok) {
            const data = await res.json();
            salvarLogin(data.cliente);
        } else {
            alert("Cliente não encontrado. Por favor, crie uma conta na aba 'Criar conta'.");
            mudarAba('cadastro');
        }
    } catch (err) {
        console.error(err);
        alert("Erro de conexão com o servidor.");
    }
});

// Função de Cadastro
document.getElementById("btn-cadastrar").addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const telefone = document.getElementById("telefone-cad").value.trim();

    if(!nome || !telefone || !endereco) return alert("Preencha todos os campos!");

    try {
        // 1. Cria o cliente
        const res = await fetch(`${API_URL}/clientes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, endereco, telefone })
        });

        if(res.ok) {
            // 2. Se criou com sucesso, faz o login automaticamente
            const loginRes = await fetch(`${API_URL}/clientes/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ telefone })
            });
            const data = await loginRes.json();
            salvarLogin(data.cliente);
        } else {
            const erro = await res.json();
            alert("Erro ao cadastrar: " + (erro.erro || "Tente novamente."));
        }
    } catch(e) {
        console.error(e);
        alert("Erro de conexão.");
    }
});

// Salva no LocalStorage e atualiza a tela
function salvarLogin(cliente) {
    clienteLogado = cliente;
    localStorage.setItem("cliente", JSON.stringify(cliente));
    mostrarLoja();
}

// Botão Sair
document.getElementById("btn-sair").addEventListener("click", () => {
    localStorage.removeItem("cliente");
    location.reload(); // Recarrega a página para voltar ao login
});

function mostrarLoja() {
    // Esconde login, mostra loja
    secaoLogin.style.display = "none";
    headerApp.style.display = "block";
    secaoProdutos.style.display = "block";
    
    // Atualiza nome no cabeçalho
    const primeiroNome = clienteLogado.nome.split(' ')[0];
    document.getElementById("nome-cliente").innerText = "Olá, " + primeiroNome;
    
    // Carrega os produtos do banco
    carregarProdutos();
}


// ============================================================
// 2. CARDÁPIO E PRODUTOS
// ============================================================

async function carregarProdutos() {
    try {
        const res = await fetch(`${API_URL}/produtos`);
        const produtos = await res.json();
        const lista = document.getElementById("lista-produtos");
        lista.innerHTML = "";

        produtos.forEach(p => {
            const div = document.createElement("div");
            div.className = "produto";
            div.dataset.categoria = p.tipo; // Usado para o filtro

            div.innerHTML = `
                <div>
                    <h4>${p.nome}</h4>
                    <p>R$ ${Number(p.valor).toFixed(2)}</p>
                </div>
                <div class="controles-add">
                    <input type="number" value="1" min="1" id="qtd-${p.id}">
                    <button onclick="addCarrinho(${p.id}, '${p.nome}', ${p.valor})" style="background:#007acc; color:white;">+</button>
                </div>
            `;
            lista.appendChild(div);
        });

        // Ativar lógica dos Filtros (Pizza, Bebida...)
        configurarFiltros();

    } catch (err) {
        console.error(err);
        lista.innerHTML = "<p>Erro ao carregar cardápio.</p>";
    }
}

function configurarFiltros() {
    document.querySelectorAll(".filtro").forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Remove classe active de todos e adiciona no clicado
            document.querySelectorAll(".filtro").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            
            const cat = e.target.dataset.categoria;
            
            // Mostra ou esconde produtos baseados na categoria
            document.querySelectorAll(".produto").forEach(prod => {
                if(cat === "Todas" || prod.dataset.categoria === cat) {
                    prod.style.display = "flex";
                } else {
                    prod.style.display = "none";
                }
            });
        });
    });
}


// ============================================================
// 3. CARRINHO DE COMPRAS
// ============================================================

window.addCarrinho = function(id, nome, valor) {
    const qtdInput = document.getElementById(`qtd-${id}`);
    const quantidade = Number(qtdInput.value); // Garante que é número

    if (quantidade < 1) return alert("Quantidade inválida");
    
    // Verifica se já tem esse item no carrinho
    const item = carrinho.find(i => i.id === id);
    if(item) {
        item.quantidade += quantidade;
    } else {
        carrinho.push({ id, nome, valor, quantidade });
    }
    
    qtdInput.value = 1; // Reseta o input para 1
    atualizarBarra(); // Atualiza o visual da barra verde
}

function atualizarBarra() {
    const total = carrinho.reduce((acc, item) => acc + (item.valor * item.quantidade), 0);
    const qtd = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    
    document.getElementById("qtd-carrinho").innerText = qtd;
    document.getElementById("total-barra").innerText = "R$ " + total.toFixed(2);
    
    // Mostra a barra se tiver itens, esconde se estiver vazia
    barraCarrinho.style.display = qtd > 0 ? "flex" : "none";
}


// ============================================================
// 4. MODAL E FINALIZAÇÃO DO PEDIDO
// ============================================================

window.abrirModalCarrinho = function() {
    const lista = document.getElementById("itens-carrinho");
    lista.innerHTML = "";
    let total = 0;

    carrinho.forEach((item, idx) => {
        total += item.valor * item.quantidade;
        const li = document.createElement("li");
        li.innerHTML = `
            <span><b>${item.quantidade}x</b> ${item.nome}</span>
            <div style="display:flex; align-items:center; gap:10px;">
                <span>R$ ${(item.valor * item.quantidade).toFixed(2)}</span>
                <button onclick="removerItem(${idx})" style="background:#c0392b; color:white; padding:2px 8px; border-radius:4px;">X</button>
            </div>
        `;
        lista.appendChild(li);
    });

    document.getElementById("total-modal").innerText = total.toFixed(2);
    modalCarrinho.style.display = "block";
}

window.fecharModalCarrinho = function() {
    modalCarrinho.style.display = "none";
}

window.removerItem = function(index) {
    carrinho.splice(index, 1); // Remove do array
    atualizarBarra(); // Atualiza barra verde
    abrirModalCarrinho(); // Recarrega a lista do modal
    
    // Se ficou vazio, fecha o modal
    if(carrinho.length === 0) fecharModalCarrinho();
}

// --- AQUI ESTAVA O ERRO ANTERIOR, AGORA CORRIGIDO ---
document.getElementById("btn-finalizar").addEventListener("click", async () => {
    // 1. Validações Básicas
    if(carrinho.length === 0) return alert("Carrinho vazio!");
    if(!clienteLogado || !clienteLogado.id) {
        alert("Erro de sessão. Faça login novamente.");
        location.reload();
        return;
    }
    
    if(!confirm("Confirmar o envio do pedido?")) return;

    // 2. Prepara os dados convertendo para NÚMEROS (Importante!)
    const payload = {
        clienteId: Number(clienteLogado.id),
        produtos: carrinho.map(i => ({
            id: Number(i.id),
            quantidade: Number(i.quantidade)
        }))
    };

    console.log("Enviando payload:", payload); // Debug no console

    try {
        // 3. Envia para o Backend
        const res = await fetch(`${API_URL}/pedidos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        // 4. Verifica Resposta
        if(res.ok) {
            const dados = await res.json();
            alert(`Pedido #${dados.pedidoId || ''} enviado com sucesso! Aguarde a entrega. 🍕`);
            
            // Limpa carrinho e fecha modal
            carrinho = [];
            atualizarBarra();
            fecharModalCarrinho();
        } else {
            // Mostra erro do servidor
            const erro = await res.json();
            console.error("Erro Server:", erro);
            alert("Ocorreu um erro: " + (erro.erro || "Desconhecido"));
        }
    } catch(e) {
        console.error("Erro Rede:", e);
        alert("Erro de conexão. Verifique se o servidor está rodando.");
    }
});