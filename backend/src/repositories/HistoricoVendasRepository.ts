// src/repositories/HistoricoVendasRepository.ts
import { pool } from "../database/db";
import { Pedido } from "../models/Pedido";

export class HistoricoVendasRepository {
    
    static async listar(): Promise<Pedido[]> {
        const query = `
            SELECT 
                p.id AS pedido_id,
                p.data,
                p.valor_total,
                c.id AS cliente_id,
                c.nome AS cliente_nome,
                c.telefone,
                c.endereco,
                pr.id AS produto_id,
                pr.nome AS produto_nome,
                pr.valor,
                pr.tipo,
                i.quantidade
            FROM pedidos p
            JOIN clientes c ON c.id = p.cliente_id
            JOIN pedido_itens i ON i.pedido_id = p.id
            JOIN produtos pr ON pr.id = i.produto_id
            ORDER BY p.data DESC;
        `;

        const { rows } = await pool.query(query);

        // Agrupar linhas (pois cada produto gera uma linha)
        const historico: { [key: number]: Pedido } = {};

        rows.forEach(r => {
            if (!historico[r.pedido_id]) {
                historico[r.pedido_id] = {
                    id: r.pedido_id,
                    data: new Date(r.data),
                    valorTotal: Number(r.valor_total),
                    cliente: {
                        id: r.cliente_id,
                        nome: r.cliente_nome,
                        telefone: r.telefone,
                        endereco: r.endereco
                    },
                    produtos: []
                };
            }

            historico[r.pedido_id].produtos.push({
                id: r.produto_id,
                nome: r.produto_nome,
                valor: Number(r.valor),
                tipo: r.tipo,
                quantidade: Number(r.quantidade)
            });
        });

        return Object.values(historico);
    }
}
