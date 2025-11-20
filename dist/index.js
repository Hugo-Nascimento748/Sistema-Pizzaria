"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const readline = require("readline-sync");
const ClienteService_1 = require("./services/ClienteService");
const ProdutoService_1 = require("./services/ProdutoService");
const PedidoService_1 = require("./services/PedidoService");
const Recibo_1 = require("./reports/Recibo");
const VendasDiarias_1 = require("./reports/VendasDiarias");
const VendasMensais_1 = require("./reports/VendasMensais");
const HistoricoVendas_1 = require("./reports/HistoricoVendas");
// ------------------ INSTÂNCIAS ------------------
const clienteService = new ClienteService_1.ClienteService();
const produtoService = new ProdutoService_1.ProdutoService();
const pedidoService = new PedidoService_1.PedidoService();
// ------------------ DADOS DE TESTE ------------------
function inicializarDadosTeste() {
    return __awaiter(this, void 0, void 0, function* () {
        // Caso queira iniciar com dados padrão, descomente abaixo:
        /*
        await clienteService.adicionarCliente({ id: 0, nome: "Ana Silva", endereco: "Rua A, 123", telefone: "99999-1111" });
        await clienteService.adicionarCliente({ id: 0, nome: "Carlos Souza", endereco: "Rua B, 456", telefone: "88888-2222" });
      
        await produtoService.adicionarProduto({ id: 0, nome: "Pizza Calabresa", valor: 35.0, tipo: "Pizza" });
        await produtoService.adicionarProduto({ id: 0, nome: "Pizza Mussarela", valor: 30.0, tipo: "Pizza" });
      
        await produtoService.adicionarProduto({ id: 0, nome: "Coca-Cola", valor: 8.0, tipo: "Bebida" });
        await produtoService.adicionarProduto({ id: 0, nome: "Suco Natural", valor: 6.0, tipo: "Bebida" });
      
        await produtoService.adicionarProduto({ id: 0, nome: "Pudim", valor: 12.0, tipo: "Sobremesa" });
        await produtoService.adicionarProduto({ id: 0, nome: "Brigadeiro", valor: 5.0, tipo: "Sobremesa" });
        */
    });
}
// ------------------ MENU CLIENTES ------------------
function menuClientes() {
    return __awaiter(this, void 0, void 0, function* () {
        let continuar;
        do {
            console.log("\n---- MENU CLIENTES ----");
            console.log("1 - Adicionar Cliente");
            console.log("2 - Editar Cliente");
            console.log("3 - Remover Cliente");
            console.log("4 - Listar Clientes");
            console.log("5 - Voltar");
            const opcao = readline.question("Escolha uma opcao: ");
            switch (opcao) {
                case "1": {
                    const nome = readline.question("Nome: ");
                    const endereco = readline.question("Endereco: ");
                    const telefone = readline.question("Telefone: ");
                    yield clienteService.adicionarCliente({ id: 0, nome, endereco, telefone });
                    break;
                }
                case "2": {
                    const clientes = yield clienteService.listarClientes();
                    if (!clientes.length)
                        return console.log("Nenhum cliente cadastrado.");
                    clientes.forEach(c => console.log(`ID: ${c.id} | Nome: ${c.nome} | Endereco: ${c.endereco} | Telefone: ${c.telefone}`));
                    const id = Number(readline.question("ID do cliente a editar: "));
                    const clienteExistente = clientes.find(c => c.id === id);
                    if (!clienteExistente)
                        return console.log("Cliente nao encontrado!");
                    console.log("\nEditando cliente (enter = manter atual):");
                    const nome = readline.question(`Nome (${clienteExistente.nome}): `);
                    const endereco = readline.question(`Endereco (${clienteExistente.endereco}): `);
                    const telefone = readline.question(`Telefone (${clienteExistente.telefone}): `);
                    const dadosAtualizados = Object.assign(Object.assign(Object.assign({}, (nome && { nome })), (endereco && { endereco })), (telefone && { telefone }));
                    yield clienteService.editarCliente(id, dadosAtualizados);
                    break;
                }
                case "3": {
                    const clientes = yield clienteService.listarClientes();
                    if (!clientes.length)
                        return console.log("Nenhum cliente cadastrado.");
                    clientes.forEach(c => console.log(`ID: ${c.id} | Nome: ${c.nome}`));
                    const id = Number(readline.question("ID do cliente a remover: "));
                    yield clienteService.removerCliente(id);
                    console.log(`Cliente ${id} removido com sucesso!`);
                    break;
                }
                case "4": {
                    const clientes = yield clienteService.listarClientes();
                    console.log("\n-- LISTA DE CLIENTES --");
                    if (!clientes.length)
                        console.log("Nenhum cliente cadastrado.");
                    else
                        clientes.forEach(c => console.log(`ID: ${c.id} | Nome: ${c.nome} | Endereco: ${c.endereco} | Telefone: ${c.telefone}`));
                    break;
                }
                case "5":
                    return;
                default:
                    console.log("Opcao invalida!");
            }
            continuar = readline.question("Deseja realizar outra operacao de cliente? (s/n): ").toLowerCase();
        } while (continuar === "s");
    });
}
// ------------------ MENU PRODUTOS ------------------
function menuProdutos() {
    return __awaiter(this, void 0, void 0, function* () {
        let continuar;
        do {
            console.log("\n---- MENU PRODUTOS ----");
            console.log("1 - Adicionar Produto");
            console.log("2 - Editar Produto");
            console.log("3 - Remover Produto");
            console.log("4 - Listar Produtos");
            console.log("5 - Voltar");
            const opcao = readline.question("Escolha uma opcao: ");
            switch (opcao) {
                case "1": {
                    const nome = readline.question("Nome do produto: ");
                    const valor = Number(readline.question("Valor: "));
                    const tipo = readline.question("Tipo (Pizza, Bebida, Sobremesa): ");
                    yield produtoService.adicionarProduto({ id: 0, nome, valor, tipo });
                    break;
                }
                case "2": {
                    const produtos = yield produtoService.listarProdutos();
                    if (!produtos.length)
                        return console.log("Nenhum produto cadastrado.");
                    produtos.forEach(p => console.log(`ID: ${p.id} | Nome: ${p.nome} | Valor: ${p.valor.toFixed(2)} | Tipo: ${p.tipo}`));
                    const id = Number(readline.question("ID do produto a editar: "));
                    const produtoExistente = produtos.find(p => p.id === id);
                    if (!produtoExistente)
                        return console.log("Produto nao encontrado!");
                    console.log("\nEditando produto (enter = manter atual):");
                    const nome = readline.question(`Nome (${produtoExistente.nome}): `);
                    const valorInput = readline.question(`Valor (${produtoExistente.valor.toFixed(2)}): `);
                    const tipo = readline.question(`Tipo (${produtoExistente.tipo}): `);
                    const dadosAtualizados = Object.assign(Object.assign(Object.assign({}, (nome && { nome })), (valorInput && { valor: Number(valorInput) })), (tipo && { tipo }));
                    yield produtoService.editarProduto(id, dadosAtualizados);
                    break;
                }
                case "3": {
                    const produtos = yield produtoService.listarProdutos();
                    if (!produtos.length)
                        return console.log("Nenhum produto cadastrado.");
                    produtos.forEach(p => console.log(`ID: ${p.id} | Nome: ${p.nome}`));
                    const id = Number(readline.question("ID do produto a remover: "));
                    yield produtoService.removerProduto(id);
                    console.log(`Produto ${id} removido com sucesso!`);
                    break;
                }
                case "4": {
                    const produtos = yield produtoService.listarProdutos();
                    console.log("\n-- LISTA DE PRODUTOS --");
                    if (!produtos.length)
                        return console.log("Nenhum produto cadastrado.");
                    const tipos = Array.from(new Set(produtos.map(p => p.tipo)));
                    tipos.forEach(tipo => {
                        console.log(`\n-- ${tipo.toUpperCase()} --`);
                        produtos
                            .filter(p => p.tipo === tipo)
                            .forEach(p => console.log(`ID: ${p.id} | Nome: ${p.nome} | Valor: ${p.valor.toFixed(2)}`));
                    });
                    break;
                }
                case "5":
                    return;
                default:
                    console.log("Opcao invalida!");
            }
            continuar = readline.question("Deseja realizar outra operacao de produto? (s/n): ").toLowerCase();
        } while (continuar === "s");
    });
}
// ------------------ CRIAR PEDIDO ------------------
function criarPedido() {
    return __awaiter(this, void 0, void 0, function* () {
        const clientes = yield clienteService.listarClientes();
        const produtos = yield produtoService.listarProdutos();
        if (!clientes.length || !produtos.length)
            return console.log("É necessário ter clientes e produtos cadastrados primeiro.");
        // Seleção do cliente
        console.log("\nEscolha o cliente:");
        clientes.forEach(c => console.log(`${c.id} - ${c.nome}`));
        const clienteId = Number(readline.question("\nID do cliente: "));
        const cliente = clientes.find(c => c.id === clienteId);
        if (!cliente)
            return console.log("Cliente não encontrado.");
        // Seleção de produtos
        const produtosEscolhidos = [];
        let adicionarMais = "s";
        while (adicionarMais === "s") {
            console.log("\nEscolha o produto:");
            produtos.forEach(p => console.log(`${p.id} - ${p.nome} (${p.valor.toFixed(2)})`));
            const produtoId = Number(readline.question("\nID do produto: "));
            const produto = produtos.find(p => p.id === produtoId);
            if (!produto) {
                console.log("\nProduto não encontrado.");
            }
            else {
                const quantidade = Number(readline.question("Quantidade: "));
                produtosEscolhidos.push({ id: produto.id, quantidade });
                console.log(`\nProduto ${produto.nome} adicionado!`);
            }
            adicionarMais = readline.question("\nDeseja adicionar outro produto? (s/n): ").toLowerCase();
        }
        // Criação do pedido
        const pedido = yield pedidoService.criarPedido(clienteId, produtosEscolhidos);
        if (!pedido) {
            console.log("Erro ao criar o pedido.");
            return;
        }
        // Forma de pagamento
        console.log("\nEscolha a forma de pagamento:");
        console.log("1 - Dinheiro");
        console.log("2 - Cartão");
        console.log("3 - Pix");
        let opcaoPagamento = readline.question("\nOpcao: ");
        while (!["1", "2", "3"].includes(opcaoPagamento)) {
            opcaoPagamento = readline.question("Opção inválida. Escolha 1, 2 ou 3: ");
        }
        const formaPagamento = {
            "1": "Dinheiro",
            "2": "Cartão",
            "3": "Pix",
        }[opcaoPagamento];
        console.log(`Pagamento selecionado: ${formaPagamento}`);
        Recibo_1.Recibo.gerar(pedido, formaPagamento);
        console.log("\nPedido finalizado com sucesso!");
    });
}
// ------------------ RELATÓRIOS ------------------
function criarRelatorioDiario() {
    return __awaiter(this, void 0, void 0, function* () {
        const pedidos = yield pedidoService.listarPedidos();
        VendasDiarias_1.VendasDiarias.gerar(pedidos);
    });
}
function criarRelatorioMensal() {
    return __awaiter(this, void 0, void 0, function* () {
        const pedidos = yield pedidoService.listarPedidos();
        VendasMensais_1.VendasMensais.gerar(pedidos);
    });
}
// ------------------ MENU PRINCIPAL ------------------
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield inicializarDadosTeste();
        let continuar;
        do {
            console.log("\n-------- MENU PRINCIPAL --------");
            console.log("1 - Clientes");
            console.log("2 - Produtos");
            console.log("3 - Criar Pedido");
            console.log("4 - Relatorio Diario");
            console.log("5 - Relatorio Mensal");
            console.log("6 - Histórico de Vendas");
            console.log("7 - Sair");
            const escolha = readline.question("\nEscolha uma opcao: ");
            switch (escolha) {
                case "1":
                    yield menuClientes();
                    break;
                case "2":
                    yield menuProdutos();
                    break;
                case "3":
                    yield criarPedido();
                    break;
                case "4":
                    yield criarRelatorioDiario();
                    break;
                case "5":
                    yield criarRelatorioMensal();
                    break;
                case "6":
                    console.log("\n======== Histórico de Vendas ========\n");
                    console.log(yield HistoricoVendas_1.HistoricoVendas.listarFormatado());
                    break;
                case "7":
                    console.log("Saindo do sistema...");
                    return;
                default:
                    console.log("Opcao invalida!");
            }
            continuar = readline.question("\nDeseja realizar outra operacao? (s/n): ").toLowerCase();
        } while (continuar === "s");
    });
}
// ------------------ EXECUÇÃO ------------------
main().catch(err => {
    console.error("Erro inesperado:", err);
    process.exit(1);
});
