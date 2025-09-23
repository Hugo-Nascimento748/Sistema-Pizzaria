"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoService = void 0;
const HistoricoVendas_1 = require("../reports/HistoricoVendas");
class PedidoService {
    constructor() {
        this.pedidos = [];
        this.contadorId = 1;
    }
    adicionarPedido(cliente, produtos, data) {
        let valorTotal = 0;
        for (const produto of produtos) {
            valorTotal += produto.valor;
        }
        console.log(`Valor Total: $${valorTotal}`);
        const pedido = {
            id: this.contadorId,
            cliente: cliente,
            data: new Date(),
            valorTotal: valorTotal,
            produtos: produtos
        };
        this.contadorId++;
        this.pedidos.push(pedido);
        console.log(`O produto do cliente ${cliente.nome} foi adicionado. Valor Total: $${valorTotal}`);
        // 🔥 REGISTRA NO HISTÓRICO DE VENDAS
        HistoricoVendas_1.HistoricoVendas.registrar(pedido);
        return pedido;
    }
    listarPedidos() {
        return this.pedidos;
    }
    removerPedido(id) {
        this.pedidos = this.pedidos.filter(p => p.id !== id);
    }
    editarPedido(id, dadosAtualizados) {
        const pedido = this.pedidos.find(p => p.id === id);
        if (pedido) {
            Object.assign(pedido, dadosAtualizados);
            console.log(`Dados atualizados.`);
        }
        else {
            console.log(`Pedido não encontrado!`);
        }
    }
}
exports.PedidoService = PedidoService;
