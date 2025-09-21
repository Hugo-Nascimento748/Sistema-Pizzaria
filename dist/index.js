"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline = require("readline-sync");
const ClienteService_1 = require("./services/ClienteService");
const ProdutoService_1 = require("./services/ProdutoService");
const PedidoService_1 = require("./services/PedidoService");
const Recibo_1 = require("./reports/Recibo");
const VendasDiarias_1 = require("./reports/VendasDiarias");
const VendasMensais_1 = require("./reports/VendasMensais");
const clienteService = new ClienteService_1.ClienteService();
const produtoService = new ProdutoService_1.ProdutoService();
const pedidoService = new PedidoService_1.PedidoService();
// ------------------ DADOS DE TESTE ------------------
clienteService.adicionarCliente({ id: 0, nome: "Ana Silva", endereco: "Rua A, 123", telefone: "99999-1111" });
clienteService.adicionarCliente({ id: 0, nome: "Carlos Souza", endereco: "Rua B, 456", telefone: "88888-2222" });
produtoService.adicionarProduto({ id: 0, nome: "Pizza Calabresa", valor: 35.0, tipo: "Pizza" });
produtoService.adicionarProduto({ id: 0, nome: "Pizza Mussarela", valor: 30.0, tipo: "Pizza" });
produtoService.adicionarProduto({ id: 0, nome: "Refrigerante Coca-Cola", valor: 8.0, tipo: "Bebida" });
produtoService.adicionarProduto({ id: 0, nome: "Suco Natural", valor: 6.0, tipo: "Bebida" });
produtoService.adicionarProduto({ id: 0, nome: "Pudim", valor: 12.0, tipo: "Sobremesa" });
produtoService.adicionarProduto({ id: 0, nome: "Brigadeiro", valor: 5.0, tipo: "Sobremesa" });
// ------------------ MENU CLIENTES ------------------
function menuClientes() {
    let continuarClientes;
    do {
        console.log("\n---- MENU CLIENTES ----");
        console.log("1 - Adicionar Cliente");
        console.log("2 - Editar Cliente");
        console.log("3 - Remover Cliente");
        console.log("4 - Listar Clientes");
        console.log("5 - Voltar");
        const opcao = readline.question("Escolha uma opcao: ");
        if (opcao === "1") {
            const nome = readline.question("Nome: ");
            const endereco = readline.question("Endereco: ");
            const telefone = readline.question("Telefone: ");
            clienteService.adicionarCliente({ id: 0, nome, endereco, telefone });
        }
        else if (opcao === "2") {
            const clientes = clienteService.listarClientes();
            if (clientes.length === 0) {
                console.log("Nenhum cliente cadastrado.");
                return;
            }
            clientes.forEach(c => console.log(`ID: ${c.id} | Nome: ${c.nome} | Endereco: ${c.endereco} | Telefone: ${c.telefone}`));
            const id = parseInt(readline.question("ID do cliente a editar: "));
            const clienteExistente = clientes.find(c => c.id === id);
            if (!clienteExistente) {
                console.log("Cliente nao encontrado!");
                return;
            }
            console.log("\nEditando cliente (deixe em branco para manter o valor atual)");
            const nome = readline.question(`Nome (${clienteExistente.nome}): `);
            const endereco = readline.question(`Endereco (${clienteExistente.endereco}): `);
            const telefone = readline.question(`Telefone (${clienteExistente.telefone}): `);
            const dadosAtualizados = {};
            if (nome)
                dadosAtualizados.nome = nome;
            if (endereco)
                dadosAtualizados.endereco = endereco;
            if (telefone)
                dadosAtualizados.telefone = telefone;
            clienteService.editarCliente(id, dadosAtualizados);
        }
        else if (opcao === "3") {
            const clientes = clienteService.listarClientes();
            if (clientes.length === 0) {
                console.log("Nenhum cliente cadastrado.");
                return;
            }
            clientes.forEach(c => console.log(`ID: ${c.id} | Nome: ${c.nome}`));
            const id = parseInt(readline.question("ID do cliente a remover: "));
            clienteService.removerCliente(id);
            console.log(`Cliente ${id} removido com sucesso!`);
        }
        else if (opcao === "4") {
            const clientes = clienteService.listarClientes();
            console.log("\n-- LISTA DE CLIENTES --");
            if (clientes.length === 0)
                console.log("Nenhum cliente cadastrado.");
            else
                clientes.forEach(c => console.log(`ID: ${c.id} | Nome: ${c.nome} | Endereco: ${c.endereco} | Telefone: ${c.telefone}`));
        }
        else if (opcao === "5")
            break;
        else
            console.log("Opcao invalida!");
        continuarClientes = readline.question("Deseja realizar outra operacao de cliente? (s/n): ").toLowerCase();
    } while (continuarClientes === "s");
}
// ------------------ MENU PRODUTOS ------------------
function menuProdutos() {
    let continuarProdutos;
    do {
        console.log("\n---- MENU PRODUTOS ----");
        console.log("1 - Adicionar Produto");
        console.log("2 - Editar Produto");
        console.log("3 - Remover Produto");
        console.log("4 - Listar Produtos");
        console.log("5 - Voltar");
        const opcao = readline.question("Escolha uma opcao: ");
        if (opcao === "1") {
            const nome = readline.question("Nome do produto: ");
            const valor = parseFloat(readline.question("Valor: "));
            const tipo = readline.question("Tipo do produto (ex: Pizza, Bebida, Sobremesa): ");
            produtoService.adicionarProduto({ id: 0, nome, valor, tipo });
        }
        else if (opcao === "2") {
            const produtos = produtoService.listarProduto();
            if (produtos.length === 0) {
                console.log("Nenhum produto cadastrado.");
                return;
            }
            produtos.forEach(p => console.log(`ID: ${p.id} | Nome: ${p.nome} | Valor: ${p.valor.toFixed(2)} | Tipo: ${p.tipo}`));
            const id = parseInt(readline.question("ID do produto a editar: "));
            const produtoExistente = produtos.find(p => p.id === id);
            if (!produtoExistente) {
                console.log("Produto nao encontrado!");
                return;
            }
            console.log("\nEditando produto (deixe em branco para manter o valor atual)");
            const nome = readline.question(`Nome (${produtoExistente.nome}): `);
            const valorString = readline.question(`Valor (${produtoExistente.valor.toFixed(2)}): `);
            const valor = valorString ? parseFloat(valorString) : undefined;
            const tipo = readline.question(`Tipo (${produtoExistente.tipo}): `);
            const dadosAtualizados = {};
            if (nome)
                dadosAtualizados.nome = nome;
            if (valor !== undefined)
                dadosAtualizados.valor = valor;
            if (tipo)
                dadosAtualizados.tipo = tipo;
            produtoService.editarProduto(id, dadosAtualizados);
        }
        else if (opcao === "3") {
            const produtos = produtoService.listarProduto();
            if (produtos.length === 0) {
                console.log("Nenhum produto cadastrado.");
                return;
            }
            produtos.forEach(p => console.log(`ID: ${p.id} | Nome: ${p.nome}`));
            const id = parseInt(readline.question("ID do produto a remover: "));
            produtoService.removerProduto(id);
            console.log(`Produto ${id} removido com sucesso!`);
        }
        else if (opcao === "4") {
            const produtos = produtoService.listarProduto();
            console.log("\n-- LISTA DE PRODUTOS --");
            if (produtos.length === 0)
                console.log("Nenhum produto cadastrado.");
            else {
                const tipos = Array.from(new Set(produtos.map(p => p.tipo)));
                tipos.forEach(tipo => {
                    console.log(`\n-- ${tipo.toUpperCase()} --`);
                    produtos.filter(p => p.tipo === tipo)
                        .forEach(p => console.log(`ID: ${p.id} | Nome: ${p.nome} | Valor: ${p.valor.toFixed(2)}`));
                });
            }
        }
        else if (opcao === "5")
            break;
        else
            console.log("Opcao invalida!");
        continuarProdutos = readline.question("Deseja realizar outra operacao de produto? (s/n): ").toLowerCase();
    } while (continuarProdutos === "s");
}
// ------------------ CRIAR PEDIDO ------------------
function criarPedido() {
    const clientes = clienteService.listarClientes();
    const produtos = produtoService.listarProduto();
    if (clientes.length === 0 || produtos.length === 0) {
        console.log("É necessário ter clientes e produtos cadastrados primeiro.");
        return;
    }
    console.log("\nEscolha o cliente:");
    clientes.forEach(c => console.log(`${c.id} - ${c.nome}`));
    const clienteId = parseInt(readline.question("ID do cliente: "));
    const cliente = clientes.find(c => c.id === clienteId);
    if (!cliente) {
        console.log("Cliente não encontrado.");
        return;
    }
    const produtosEscolhidos = [];
    let adicionarMais = "s";
    while (adicionarMais === "s") {
        console.log("Escolha o produto:");
        produtos.forEach(p => console.log(`${p.id} - ${p.nome} (${p.valor.toFixed(2)})`));
        const produtoId = parseInt(readline.question("ID do produto: "));
        const produto = produtos.find(p => p.id === produtoId);
        if (produto) {
            produtosEscolhidos.push(produto);
            console.log(`Produto ${produto.nome} adicionado!`);
        }
        else {
            console.log("Produto não encontrado.");
        }
        adicionarMais = readline.question("Deseja adicionar outro produto? (s/n): ").toLowerCase();
        while (adicionarMais !== "s" && adicionarMais !== "n") {
            adicionarMais = readline.question("Digite 's' ou 'n': ").toLowerCase();
        }
    }
    const pedido = pedidoService.adicionarPedido(cliente, produtosEscolhidos, new Date());
    // --- Escolha da forma de pagamento ---
    console.log("\nEscolha a forma de pagamento:");
    console.log("1 - Dinheiro");
    console.log("2 - Cartão");
    console.log("3 - Pix");
    let opcaoPagamento = readline.question("Opcao: ");
    while (!["1", "2", "3"].includes(opcaoPagamento)) {
        opcaoPagamento = readline.question("Opção inválida. Escolha 1, 2 ou 3: ");
    }
    let formaPagamento = "";
    if (opcaoPagamento === "1")
        formaPagamento = "Dinheiro";
    else if (opcaoPagamento === "2")
        formaPagamento = "Cartão";
    else if (opcaoPagamento === "3")
        formaPagamento = "Pix";
    console.log(`Pagamento selecionado: ${formaPagamento}`);
    Recibo_1.Recibo.gerar(pedido, formaPagamento);
    console.log("Pedido finalizado com sucesso!");
}
// ------------------ RELATÓRIOS ------------------
function criarRelatorioDiario() { VendasDiarias_1.VendasDiarias.gerar(pedidoService.listarPedidos()); }
function criarRelatorioMensal() { VendasMensais_1.VendasMensais.gerar(pedidoService.listarPedidos()); }
// ------------------ MENU PRINCIPAL ------------------
let continuar;
do {
    console.log("\n-------- MENU PRINCIPAL --------");
    console.log("1 - Clientes");
    console.log("2 - Produtos");
    console.log("3 - Criar Pedido");
    console.log("4 - Relatorio Diario");
    console.log("5 - Relatorio Mensal");
    console.log("6 - Sair");
    const escolha = readline.question("Escolha uma opcao: ");
    if (escolha === "1")
        menuClientes();
    else if (escolha === "2")
        menuProdutos();
    else if (escolha === "3")
        criarPedido();
    else if (escolha === "4")
        criarRelatorioDiario();
    else if (escolha === "5")
        criarRelatorioMensal();
    else if (escolha === "6") {
        console.log("Saindo do sistema...");
        break;
    }
    else
        console.log("Opcao invalida!");
    continuar = readline.question("Deseja realizar outra operacao? (s/n): ").toLowerCase();
} while (continuar === "s");
