// src/reports/HistoricoVendas.ts
import { HistoricoVendasRepository } from "../repositories/HistoricoVendasRepository";
import { formatarData, formatarMoeda } from "../utils/Formatador";

export class HistoricoVendas {

    static async listarFormatado(): Promise<string> {
        const pedidos = await HistoricoVendasRepository.listar();

        if (pedidos.length === 0) return "Nenhuma venda registrada.";

        return pedidos.map(p => {
            const produtos = p.produtos.map(pr => `${pr.nome} (x${pr.quantidade})`).join(" | ");

            return `${formatarData(p.data)}  
Cliente: ${p.cliente.nome}  
Produtos: ${produtos}  
Total: ${formatarMoeda(p.valorTotal)}\n-----------------------------`;
        }).join("\n");
    }
}
