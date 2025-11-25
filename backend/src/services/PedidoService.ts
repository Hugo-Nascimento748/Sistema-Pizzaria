import { PedidoRepository } from "../repositories/PedidoRepository";

export class PedidoService {

    async listarPedidos() {
        return await PedidoRepository.listar();
    }

    async detalharPedido(id: number) {
        return await PedidoRepository.detalhar(id);
    }

    async removerPedido(id: number) {
        return await PedidoRepository.remover(id);
    }

    // --- ATENÇÃO AQUI ---
    // A função PRECISA receber (clienteId, produtos, formaPagamento)
    async criarPedido(clienteId: number, produtos: any[], formaPagamento: string) {
        
        // Debug para você ver no terminal se chegou aqui
        console.log("Service recebeu pagamento:", formaPagamento);

        // E precisa REPASSAR para o Repository
        return await PedidoRepository.criar(clienteId, produtos, formaPagamento);
    }
}