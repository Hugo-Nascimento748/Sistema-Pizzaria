import { PedidoRepository } from "../repositories/PedidoRepository";

export class PedidoService {

    // A função do Service agora é apenas chamar o Repository
    // Isso mantém o código organizado e evita o erro de importação

    async listarPedidos() {
        return await PedidoRepository.listar();
    }

    async detalharPedido(id: number) {
        return await PedidoRepository.detalhar(id);
    }

    async removerPedido(id: number) {
        return await PedidoRepository.remover(id);
    }

    async criarPedido(clienteId: number, produtos: any[]) {
        return await PedidoRepository.criar(clienteId, produtos);
    }
}