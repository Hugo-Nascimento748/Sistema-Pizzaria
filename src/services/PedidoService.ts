// src/services/PedidoService.ts
import { PedidoRepository } from "../repositories/PedidoRepository";

export class PedidoService {

    async criarPedido(clienteId: number, produtos: { id: number; quantidade: number }[]) {
        const pedidoId = await PedidoRepository.criar(clienteId, produtos);

        // Busca o pedido completo já formatado
        const pedido = await PedidoRepository.detalhar(pedidoId);

        if (!pedido) {
            throw new Error("Erro interno: pedido criado mas não encontrado.");
        }

        return pedido;
    }

    async listarPedidos() {
        return await PedidoRepository.listar();
    }

    async removerPedido(id: number) {
        await PedidoRepository.remover(id);
    }

    async detalharPedido(id: number) {
        return await PedidoRepository.detalhar(id);
    }
}
