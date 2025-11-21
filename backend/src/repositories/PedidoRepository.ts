import { pool } from "../database/db";
import { Pedido } from "../models/Pedido";

export class PedidoRepository {

    // Listar (Resumo)
    static async listar(): Promise<Pedido[]> {
        const query = `
            SELECT p.id, p.data, p.valor_total, c.nome as cliente_nome
            FROM pedidos p
            LEFT JOIN clientes c ON c.id = p.cliente_id
            ORDER BY p.id DESC
        `;
        const { rows } = await pool.query(query);
        return rows.map(r => ({
            id: r.id,
            data: new Date(r.data),
            status: "",
            valorTotal: Number(r.valor_total),
            cliente: { id: 0, nome: r.cliente_nome || "Cliente Desconhecido", telefone: "", endereco: "" },
            produtos: []
        }));
    }

    // Detalhar
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
            id: 0,
            nome: item.nome || "Produto Deletado",
            tipo: "Item",
            valor: Number(item.valor || 0),
            quantidade: item.quantidade
        }));

        return {
            id: pedidoRaw.id,
            data: new Date(pedidoRaw.data),
            status: pedidoRaw.status || "",
            valorTotal: Number(pedidoRaw.valor_total),
            cliente: { id: pedidoRaw.cliente_id || 0, nome: clienteRaw.nome, telefone: clienteRaw.telefone, endereco: clienteRaw.endereco },
            produtos: itensFormatados
        };
    }

    // --- REMOVER COM LOGS DE ESPIÃO ---
    static async remover(id: number) {
        console.log(`\n--- 🕵️ INICIANDO REMOÇÃO DO PEDIDO #${id} ---`);
        const client = await pool.connect();
        
        try {
            await client.query("BEGIN");

            // 1. Busca o valor
            console.log("1. Buscando valor do pedido no banco...");
            const resConsulta = await client.query("SELECT valor_total FROM pedidos WHERE id = $1", [id]);
            
            if (resConsulta.rows.length === 0) {
                console.log("❌ ERRO: Pedido não encontrado no banco (SELECT retornou vazio).");
            } else {
                const dadosBrutos = resConsulta.rows[0];
                console.log("🔎 Dados encontrados:", dadosBrutos);
                
                const valor = Number(dadosBrutos.valor_total);
                console.log(`🔢 Valor convertido para número: ${valor}`);

                if (!isNaN(valor) && valor > 0) {
                    console.log("💾 Tentando salvar no histórico_vendas...");
                    await client.query(
                        "INSERT INTO historico_vendas (valor, data) VALUES ($1, NOW())", 
                        [valor]
                    );
                    console.log("✅ SUCESSO: Inserido na tabela histórico!");
                } else {
                    console.log("⚠️ AVISO: Valor é zero ou inválido. O histórico foi PULADO.");
                }
            }

            // 2. Remove
            console.log("2. Apagando itens e pedido...");
            await client.query("DELETE FROM pedido_itens WHERE pedido_id = $1", [id]);
            const res = await client.query("DELETE FROM pedidos WHERE id = $1", [id]);
            
            console.log("3. Confirmando transação (COMMIT)...");
            await client.query("COMMIT");
            console.log("🏁 PROCESSO FINALIZADO COM SUCESSO.\n");

        } catch (err) { 
            console.error("❌ ERRO FATAL NO PROCESSO:", err);
            await client.query("ROLLBACK"); 
            throw err; 
        } finally { 
            client.release(); 
        }
    }

    // Criar (Mantido)
    static async criar(clienteId: number, produtos: any[]) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const ids = produtos.map(p => p.id);
            const prodDb = await client.query(`SELECT id, valor FROM produtos WHERE id = ANY($1)`, [ids]);
            let total = 0;
            for (const item of produtos) {
                const pBanco = prodDb.rows.find(p => p.id === item.id);
                if(pBanco) total += Number(pBanco.valor) * item.quantidade;
            }
            const res = await client.query(`INSERT INTO pedidos (cliente_id, data, valor_total, status) VALUES ($1, NOW(), $2, 'Pendente') RETURNING id`, [clienteId, total]);
            const pedidoId = res.rows[0].id;
            for (const p of produtos) {
                await client.query(`INSERT INTO pedido_itens (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3)`, [pedidoId, p.id, p.quantidade]);
            }
            await client.query("COMMIT");
            return pedidoId;
        } catch (err) { await client.query("ROLLBACK"); throw err; } finally { client.release(); }
    }
}