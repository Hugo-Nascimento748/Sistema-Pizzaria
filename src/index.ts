// src/index.ts
import * as readline from "readline-sync";

import { ClienteService } from "./services/ClienteService";
import { ProdutoService } from "./services/ProdutoService";
import { PedidoService } from "./services/PedidoService";

import { Recibo } from "./reports/Recibo";
import { VendasDiarias } from "./reports/VendasDiarias";
import { VendasMensais } from "./reports/VendasMensais";
import { HistoricoVendas } from "./reports/HistoricoVendas";

// ------------------ INSTÂNCIAS ------------------
const clienteService = new ClienteService();
const produtoService = new ProdutoService();
const pedidoService = new PedidoService();

// ------------------ DADOS DE TESTE ------------------
async function inicializarDadosTeste() {
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
}

// ------------------ MENU CLIENTES ------------------
async function menuClientes() {
  let continuar: string;
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

        await clienteService.adicionarCliente({ id: 0, nome, endereco, telefone });
        break;
      }

      case "2": {
        const clientes = await clienteService.listarClientes();
        if (!clientes.length) return console.log("Nenhum cliente cadastrado.");

        clientes.forEach(c =>
          console.log(`ID: ${c.id} | Nome: ${c.nome} | Endereco: ${c.endereco} | Telefone: ${c.telefone}`)
        );

        const id = Number(readline.question("ID do cliente a editar: "));
        const clienteExistente = clientes.find(c => c.id === id);

        if (!clienteExistente) return console.log("Cliente nao encontrado!");

        console.log("\nEditando cliente (enter = manter atual):");

        const nome = readline.question(`Nome (${clienteExistente.nome}): `);
        const endereco = readline.question(`Endereco (${clienteExistente.endereco}): `);
        const telefone = readline.question(`Telefone (${clienteExistente.telefone}): `);

        const dadosAtualizados: any = {
          ...(nome && { nome }),
          ...(endereco && { endereco }),
          ...(telefone && { telefone }),
        };

        await clienteService.editarCliente(id, dadosAtualizados);
        break;
      }

      case "3": {
        const clientes = await clienteService.listarClientes();
        if (!clientes.length) return console.log("Nenhum cliente cadastrado.");

        clientes.forEach(c => console.log(`ID: ${c.id} | Nome: ${c.nome}`));

        const id = Number(readline.question("ID do cliente a remover: "));
        await clienteService.removerCliente(id);

        console.log(`Cliente ${id} removido com sucesso!`);
        break;
      }

      case "4": {
        const clientes = await clienteService.listarClientes();
        console.log("\n-- LISTA DE CLIENTES --");

        if (!clientes.length) console.log("Nenhum cliente cadastrado.");
        else clientes.forEach(c =>
          console.log(`ID: ${c.id} | Nome: ${c.nome} | Endereco: ${c.endereco} | Telefone: ${c.telefone}`)
        );
        break;
      }

      case "5":
        return;

      default:
        console.log("Opcao invalida!");
    }

    continuar = readline.question("Deseja realizar outra operacao de cliente? (s/n): ").toLowerCase();
  } while (continuar === "s");
}

// ------------------ MENU PRODUTOS ------------------
async function menuProdutos() {
  let continuar: string;
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

        await produtoService.adicionarProduto({ id: 0, nome, valor, tipo });
        break;
      }

      case "2": {
        const produtos = await produtoService.listarProdutos();
        if (!produtos.length) return console.log("Nenhum produto cadastrado.");

        produtos.forEach(p => console.log(`ID: ${p.id} | Nome: ${p.nome} | Valor: ${p.valor.toFixed(2)} | Tipo: ${p.tipo}`));

        const id = Number(readline.question("ID do produto a editar: "));
        const produtoExistente = produtos.find(p => p.id === id);

        if (!produtoExistente) return console.log("Produto nao encontrado!");

        console.log("\nEditando produto (enter = manter atual):");

        const nome = readline.question(`Nome (${produtoExistente.nome}): `);
        const valorInput = readline.question(`Valor (${produtoExistente.valor.toFixed(2)}): `);
        const tipo = readline.question(`Tipo (${produtoExistente.tipo}): `);

        const dadosAtualizados: any = {
          ...(nome && { nome }),
          ...(valorInput && { valor: Number(valorInput) }),
          ...(tipo && { tipo }),
        };

        await produtoService.editarProduto(id, dadosAtualizados);
        break;
      }

      case "3": {
        const produtos = await produtoService.listarProdutos();
        if (!produtos.length) return console.log("Nenhum produto cadastrado.");

        produtos.forEach(p => console.log(`ID: ${p.id} | Nome: ${p.nome}`));

        const id = Number(readline.question("ID do produto a remover: "));
        await produtoService.removerProduto(id);

        console.log(`Produto ${id} removido com sucesso!`);
        break;
      }

      case "4": {
        const produtos = await produtoService.listarProdutos();

        console.log("\n-- LISTA DE PRODUTOS --");
        if (!produtos.length) return console.log("Nenhum produto cadastrado.");

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
}

// ------------------ CRIAR PEDIDO ------------------
async function criarPedido() {
  const clientes = await clienteService.listarClientes();
  const produtos = await produtoService.listarProdutos();

  if (!clientes.length || !produtos.length)
    return console.log("É necessário ter clientes e produtos cadastrados primeiro.");

  // Seleção do cliente
  console.log("\nEscolha o cliente:");
  clientes.forEach(c => console.log(`${c.id} - ${c.nome}`));

  const clienteId = Number(readline.question("\nID do cliente: "));
  const cliente = clientes.find(c => c.id === clienteId);

  if (!cliente) return console.log("Cliente não encontrado.");

  // Seleção de produtos
  const produtosEscolhidos: any[] = [];
  let adicionarMais = "s";

  while (adicionarMais === "s") {
    console.log("\nEscolha o produto:");
    produtos.forEach(p => console.log(`${p.id} - ${p.nome} (${p.valor.toFixed(2)})`));

    const produtoId = Number(readline.question("\nID do produto: "));
    const produto = produtos.find(p => p.id === produtoId);

    if (!produto) {
      console.log("\nProduto não encontrado.");
    } else {
      const quantidade = Number(readline.question("Quantidade: "));
      produtosEscolhidos.push({ id: produto.id, quantidade });
      console.log(`\nProduto ${produto.nome} adicionado!`);
    }

    adicionarMais = readline.question("\nDeseja adicionar outro produto? (s/n): ").toLowerCase();
  }

  // Criação do pedido
  const pedido = await pedidoService.criarPedido(clienteId, produtosEscolhidos);

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

  Recibo.gerar(pedido, formaPagamento!);

  console.log("\nPedido finalizado com sucesso!");
}

// ------------------ RELATÓRIOS ------------------
async function criarRelatorioDiario() {
  const pedidos = await pedidoService.listarPedidos();
  VendasDiarias.gerar(pedidos);
}

async function criarRelatorioMensal() {
  const pedidos = await pedidoService.listarPedidos();
  VendasMensais.gerar(pedidos);
}

// ------------------ MENU PRINCIPAL ------------------
async function main() {
  await inicializarDadosTeste();

  let continuar: string;
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
      case "1": await menuClientes(); break;
      case "2": await menuProdutos(); break;
      case "3": await criarPedido(); break;
      case "4": await criarRelatorioDiario(); break;
      case "5": await criarRelatorioMensal(); break;

      case "6":
        console.log("\n======== Histórico de Vendas ========\n");
        console.log(await HistoricoVendas.listarFormatado());
        break;

      case "7":
        console.log("Saindo do sistema...");
        return;

      default:
        console.log("Opcao invalida!");
    }

    continuar = readline.question("\nDeseja realizar outra operacao? (s/n): ").toLowerCase();
  } while (continuar === "s");
}

// ------------------ EXECUÇÃO ------------------
main().catch(err => {
  console.error("Erro inesperado:", err);
  process.exit(1);
});
