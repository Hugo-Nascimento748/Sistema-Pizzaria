import { Cliente } from "./models/Cliente";
import { Produto } from "./models/Produto";
import { Pedido } from "./models/Pedido";
import { PedidoService } from "./services/PedidoService";
import { Recibo } from "./reports/Recibo";
import { VendasDiarias } from "./reports/VendasDiarias";
import { VendasMensais } from "./reports/VendasMensais";
import * as readline from "readline-sync";

const pedidoService = new PedidoService();
const clientes: Cliente[] = [];
const produtos: Produto[] = [];

function adicionarCliente() {
    const nome = readline.question("Nome do cliente: ");
    const endereco = readline.question("Endereço: ");
    const telefone = readline.question("Telefone: ");
    const id = clientes.length + 1;
    clientes.push({id, nome, telefone, endereco});
    console.log(`Cliente ${nome} adicionado!`);
}

function adicionarProduto() {
    const nome = readline.question("Nome do produto: ");
    const valor = parseFloat(readline.question("Valor: "));
    const id = produtos.length + 1;
    produtos.push({nome, valor, id});
}

function criarPedido() {
  if (clientes.length === 0 || produtos.length === 0) {
    console.log("É necessário ter clientes e produtos cadastrados primeiro.");
    return;
  }


  console.log("Escolha o cliente:");
  clientes.forEach(c => console.log(`${c.id} - ${c.nome}`));
  const clienteId = parseInt(readline.question("ID do cliente: "));
  const cliente = clientes.find(c => c.id === clienteId);
  if (!cliente) {
    console.log("Cliente não encontrado.");
    return;
  }

  const produtosEscolhidos: Produto[] = [];
  let adicionarMais = "s";

  while (adicionarMais === "s") {
    console.log("Escolha o produto:");
    produtos.forEach(p => console.log(`${p.id} - ${p.nome} (${p.valor.toFixed(2)})`));

    const produtoId = parseInt(readline.question("ID do produto: "));
    const produto = produtos.find(p => p.id === produtoId);

    if (produto) {
      produtosEscolhidos.push(produto);
      console.log(`Produto ${produto.nome} adicionado!`);
    } else {
      console.log("Produto não encontrado.");
    }

    adicionarMais = readline.question("Deseja adicionar outro produto? (s/n): ").toLowerCase();
    while (adicionarMais !== "s" && adicionarMais !== "n") {
      adicionarMais = readline.question("Digite 's' para sim ou 'n' para não: ").toLowerCase();
    }
  }

  
  const pedido = pedidoService.adicionarPedido(cliente, produtosEscolhidos, new Date());


  const pagamento = readline.question("Forma de pagamento (Dinheiro/Cartão/Pix): ");
  console.log(`Pagamento selecionado: ${pagamento}`);


  Recibo.gerar(pedido);

  console.log("Pedido finalizado com sucesso!");
}    

function criarRelatorioDiario() {
    VendasDiarias.gerar(pedidoService.listarPedidos());
}

function criarRelatorioMensal() {
    VendasMensais.gerar(pedidoService.listarPedidos());
}

let continuar: string;
do {
    console.log(`\n--------- Menu de ações ---------`);
    console.log(`\n1 - Cadastrar Cliente.\n2 - Cadastrar Produto.\n3 - Criar Pedido.
        \n4 - Ver relatório diário.\n5 - Ver relatório mensal.\n6 - Sair...`);
    let escolha = readline.question("Escolha uma opcão: ");

    if (escolha === "6") {
        console.log("Saindo do sistema...");
        break
    }
    else if (escolha === "1"){
        console.log("Opção escolhida: Cadastrar Cliente!");
        adicionarCliente();

    }
    else if (escolha === "2"){
        console.log("Opção escolhida: Cadastrar Produto!");
        adicionarProduto();
    }
    else if (escolha === "3"){
        console.log("Opção escolhida: Criar Pedido!");
        criarPedido();
    }
    else if (escolha === "4"){
        console.log("Opção escolhida: Ver relatório diário!");
        criarRelatorioDiario();
    }
    else if (escolha === "5"){
        console.log("Opção escolhida: Ver relatório mensal!");
        criarRelatorioMensal();
    }
    else {
        console.log("Opção inválida!");
    }

    continuar = readline.question("Deseja fazer outra coisa? (s/n)").toLowerCase();
    
}
    while (continuar === "s");
