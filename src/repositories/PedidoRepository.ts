import { pool } from "../database/db";
import { Pedido } from "../models/Pedido";

export class PedidoRepository {

    // 📌 LISTAR TODOS (resumido)
    static async listar(): Promise<Pedido[]> {
        const query = `
            SELECT 
                p.id AS pedido_id,
                p.data,
                c.id AS cliente_id,
                c.nome AS cliente_nome,
                c.telefone,
                c.endereco,
                COALESCE(SUM(pr.valor * i.quantidade), 0) AS total
            FROM pedidos p
            JOIN clientes c ON c.id = p.cliente_id
            LEFT JOIN pedido_itens i ON i.pedido_id = p.id
            LEFT JOIN produtos pr ON pr.id = i.produto_id
            GROUP BY p.id, c.id
            ORDER BY p.id;
        `;

        const { rows } = await pool.query(query);

        return rows.map(r => ({
            id: r.pedido_id,
            data: new Date(r.data),
            valorTotal: Number(r.total),
            cliente: {
                id: r.cliente_id,
                nome: r.cliente_nome,
                telefone: r.telefone,
                endereco: r.endereco
            },
            produtos: [] // carregados só no detalhar
        }));
    }

    // 📌 DETALHAR UM PEDIDO
    static async detalhar(id: number): Promise<Pedido | null> {
        const query = `
            SELECT 
                p.id AS pedido_id,
                p.data,
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
            WHERE p.id = $1;
        `;

        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) return null;

        const p = rows[0];

        return {
            id: p.pedido_id,
            data: new Date(p.data),
            valorTotal: rows.reduce((t, r) => t + Number(r.valor) * Number(r.quantidade), 0),
            cliente: {
                id: p.cliente_id,
                nome: p.cliente_nome,
                telefone: p.telefone,
                endereco: p.endereco
            },
            produtos: rows.map(r => ({
                id: r.produto_id,
                nome: r.produto_nome,
                valor: Number(r.valor),
                tipo: r.tipo,
                quantidade: Number(r.quantidade)
            }))
        };
    }

    // 📌 CRIAR PEDIDO — calculando pelo banco
    static async criar(clienteId: number, produtos: { id: number; quantidade: number }[]) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            // 🚨 GARANTE QUE PRODUTOS EXISTEM E TEM PREÇO
            const ids = produtos.map(p => p.id);

            const produtosDb = await client.query(
                `SELECT id, valor FROM produtos WHERE id = ANY($1);`,
                [ids]
            );

            if (produtosDb.rows.length !== produtos.length) {
                throw new Error("Alguns produtos enviados não existem no banco.");
            }

            let total = 0;
            for (const item of produtos) {
                const produtoBanco = produtosDb.rows.find(p => p.id === item.id);
                total += Number(produtoBanco.valor) * item.quantidade;
            }

            // 🔹 INSERE O PEDIDO
            const pedidoInsert = await client.query(
                `INSERT INTO pedidos (cliente_id, data, valor_total)
                 VALUES ($1, NOW(), $2)
                 RETURNING id;`,
                [clienteId, total]
            );

            const pedidoId = pedidoInsert.rows[0].id;

            // 🔹 INSERE OS ITENS
            for (const p of produtos) {
                await client.query(
                    `INSERT INTO pedido_itens (pedido_id, produto_id, quantidade)
                     VALUES ($1, $2, $3);`,
                    [pedidoId, p.id, p.quantidade]
                );
            }

            await client.query("COMMIT");
            return pedidoId;

        } catch (err) {
            await client.query("ROLLBACK");
            console.error("Erro ao criar pedido:", err);
            throw err;
        } finally {
            client.release();
        }
    }

    // 📌 REMOVER
    static async remover(id: number) {
        await pool.query("DELETE FROM pedido_itens WHERE pedido_id = $1", [id]);
        await pool.query("DELETE FROM pedidos WHERE id = $1", [id]);
    }
}
