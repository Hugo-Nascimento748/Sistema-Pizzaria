import { pool } from "../database/db";
import { Pedido } from "../models/Pedido";

export class PedidoRepository {

    static async listar(): Promise<Pedido[]> {
        const query = `
            SELECT p.id, p.data, p.valor_total, p.forma_pagamento, c.nome as cliente_nome
            FROM pedidos p
            LEFT JOIN clientes c ON c.id = p.cliente_id
            ORDER BY p.id DESC
        `;
        const { rows } = await pool.query(query);
        return rows.map(r => ({
            id: r.id,
            data: new Date(r.data),
            valorTotal: Number(r.valor_total),
            formaPagamento: r.forma_pagamento || "Dinheiro", // Traz do banco
            status: "",
            cliente: { id: 0, nome: r.cliente_nome || "Cliente", telefone: "", endereco: "" },
            produtos: []
        }));
    }

    static async detalhar(id: number): Promise<Pedido | null> {
        const resPedido = await pool.query(`SELECT * FROM pedidos WHERE id = $1`, [id]);
        if (resPedido.rows.length === 0) return null;
        const pedidoRaw = resPedido.rows[0];

        let clienteRaw = { nome: "Cliente Removido", telefone: "-", endereco: "-" };
        if (pedidoRaw.cliente_id) {
            const resCliente = await pool.query(`SELECT * FROM clientes WHERE id = $1`, [pedidoRaw.cliente_id]);
            if (resCliente.rows.length > 0) clienteRaw = resCliente.rows[0];
        }

        const queryItens = `SELECT pi.quantidade, pr.nome, pr.valor FROM pedido_itens pi LEFT JOIN produtos pr ON pr.id = pi.produto_id WHERE pi.pedido_id = $1`;
        const resItens = await pool.query(queryItens, [id]);
        
        const itensFormatados = resItens.rows.map(item => ({
            id: 0, nome: item.nome || "Item", tipo: "Item", valor: Number(item.valor || 0), quantidade: item.quantidade
        }));

        return {
            id: pedidoRaw.id,
            data: new Date(pedidoRaw.data),
            valorTotal: Number(pedidoRaw.valor_total),
            formaPagamento: pedidoRaw.forma_pagamento || "Dinheiro",
            status: pedidoRaw.status || "",
            cliente: { id: pedidoRaw.cliente_id || 0, nome: clienteRaw.nome, telefone: clienteRaw.telefone, endereco: clienteRaw.endereco },
            produtos: itensFormatados
        };
    }

    static async remover(id: number) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            // Salva no histórico antes de apagar
            const resData = await client.query("SELECT valor_total, forma_pagamento FROM pedidos WHERE id = $1", [id]);
            if (resData.rows.length > 0) {
                const valor = Number(resData.rows[0].valor_total);
                const pag = resData.rows[0].forma_pagamento || 'Dinheiro';
                if (valor > 0) {
                    await client.query("INSERT INTO historico_vendas (valor, data, forma_pagamento) VALUES ($1, NOW(), $2)", [valor, pag]);
                }
            }
            await client.query("DELETE FROM pedido_itens WHERE pedido_id = $1", [id]);
            await client.query("DELETE FROM pedidos WHERE id = $1", [id]);
            await client.query("COMMIT");
        } catch (err) { await client.query("ROLLBACK"); throw err; } finally { client.release(); }
    }

    // --- AQUI É O IMPORTANTE ---
    static async criar(clienteId: number, produtos: any[], formaPagamento: string) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            
            // 1. Calcula Total
            const ids = produtos.map(p => p.id);
            const prodDb = await client.query(`SELECT id, valor FROM produtos WHERE id = ANY($1)`, [ids]);
            let total = 0;
            for (const item of produtos) {
                const pBanco = prodDb.rows.find(p => p.id === item.id);
                if(pBanco) total += Number(pBanco.valor) * item.quantidade;
            }

            // 2. Define pagamento (Se vier vazio, vira Dinheiro)
            const pagFinal = formaPagamento || 'Dinheiro';
            console.log("Repository salvando pagamento:", pagFinal); // Debug

            // 3. Insert com forma_pagamento
            const res = await client.query(
                `INSERT INTO pedidos (cliente_id, data, valor_total, status, forma_pagamento) 
                 VALUES ($1, NOW(), $2, 'Pendente', $3) RETURNING id`, 
                [clienteId, total, pagFinal]
            );
            const pedidoId = res.rows[0].id;

            for (const p of produtos) {
                await client.query(`INSERT INTO pedido_itens (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3)`, [pedidoId, p.id, p.quantidade]);
            }

            await client.query("COMMIT");
            return pedidoId;
        } catch (err) { await client.query("ROLLBACK"); throw err; } finally { client.release(); }
    }
}