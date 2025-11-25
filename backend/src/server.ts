import express, { Request, Response } from "express";
import cors from "cors";
import { pool } from "./database/db"; // Certifique-se que o caminho está certo
import { ProdutoService } from "./services/ProdutoService";
import { ClienteService } from "./services/ClienteService";

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'usuario', 'senha'] }));
app.use(express.json());

// Mantemos os serviços de cliente e produto que já funcionavam
const produtoService = new ProdutoService();
const clienteService = new ClienteService();

// =============================================================
//  ROTAS DE PEDIDOS (LÓGICA DIRETA - SEM SERVICE/REPOSITORY)
// =============================================================

// 1. LISTAR PEDIDOS
app.get("/pedidos", async (req: Request, res: Response) => {
    try {
        const query = `
            SELECT p.id, p.data, p.valor_total, p.forma_pagamento, c.nome as cliente_nome
            FROM pedidos p
            LEFT JOIN clientes c ON c.id = p.cliente_id
            ORDER BY p.id DESC
        `;
        const result = await pool.query(query);
        
        const pedidosFormatados = result.rows.map(r => ({
            id: r.id,
            data: r.data,
            valorTotal: Number(r.valor_total),
            formaPagamento: r.forma_pagamento || "Dinheiro", // Garante visualização
            status: "Pendente",
            cliente: { nome: r.cliente_nome || "Cliente" },
            produtos: []
        }));
        
        res.json(pedidosFormatados);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ erro: err.message });
    }
});

// 2. DETALHAR PEDIDO
app.get("/pedidos/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        const resPed = await pool.query("SELECT * FROM pedidos WHERE id = $1", [id]);
        if (resPed.rows.length === 0) return res.status(404).json({ erro: "Não achou" });
        
        const p = resPed.rows[0];
        const resCli = await pool.query("SELECT * FROM clientes WHERE id = $1", [p.cliente_id]);
        const resItens = await pool.query(`
            SELECT pi.quantidade, pr.nome, pr.valor 
            FROM pedido_itens pi 
            JOIN produtos pr ON pr.id = pi.produto_id 
            WHERE pi.pedido_id = $1`, [id]);

        res.json({
            id: p.id,
            data: p.data,
            valorTotal: Number(p.valor_total),
            formaPagamento: p.forma_pagamento || "Dinheiro",
            cliente: resCli.rows[0] || {},
            produtos: resItens.rows.map(i => ({ nome: i.nome, quantidade: i.quantidade, valor: i.valor }))
        });
    } catch (err: any) { res.status(500).json({ erro: err.message }); }
});

// 3. CRIAR PEDIDO (AQUI ESTAVA O PROBLEMA - AGORA ESTÁ DIRETO)
app.post("/pedidos", async (req: Request, res: Response) => {
    const { clienteId, produtos, formaPagamento } = req.body;
    
    // Debug no terminal
    console.log("🔥 POST /pedidos RECEBIDO!");
    console.log("💰 Pagamento vindo do front:", formaPagamento);

    if (!clienteId || !produtos || produtos.length === 0) {
        return res.status(400).json({ erro: "Dados inválidos" });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Calcula total
        const ids = produtos.map((p: any) => p.id);
        const prodDb = await client.query(`SELECT id, valor FROM produtos WHERE id = ANY($1)`, [ids]);
        
        let total = 0;
        for (const item of produtos) {
            const pBanco = prodDb.rows.find((p: any) => p.id === item.id);
            if (pBanco) total += Number(pBanco.valor) * item.quantidade;
        }

        // Define pagamento (Se vier vazio, vira Dinheiro)
        const pagFinal = formaPagamento || 'Dinheiro';

        // INSERT DIRETO
        const insertQuery = `
            INSERT INTO pedidos (cliente_id, data, valor_total, status, forma_pagamento) 
            VALUES ($1, NOW(), $2, 'Pendente', $3) 
            RETURNING id
        `;
        const resInsert = await client.query(insertQuery, [clienteId, total, pagFinal]);
        const pedidoId = resInsert.rows[0].id;

        // INSERT ITENS
        for (const p of produtos) {
            await client.query(
                `INSERT INTO pedido_itens (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3)`,
                [pedidoId, p.id, p.quantidade]
            );
        }

        await client.query("COMMIT");
        console.log("✅ Pedido criado com sucesso no banco!");
        res.status(201).json({ pedidoId });

    } catch (err: any) {
        await client.query("ROLLBACK");
        console.error("❌ Erro ao criar:", err);
        res.status(500).json({ erro: err.message });
    } finally {
        client.release();
    }
});

// 4. DELETAR PEDIDO (SALVANDO HISTÓRICO CORRETO)
app.delete("/pedidos/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Busca dados antes de apagar
        const resData = await client.query("SELECT valor_total, forma_pagamento FROM pedidos WHERE id = $1", [id]);
        
        if (resData.rows.length > 0) {
            const valor = Number(resData.rows[0].valor_total);
            const pag = resData.rows[0].forma_pagamento || 'Dinheiro';

            if (valor > 0) {
                await client.query(
                    "INSERT INTO historico_vendas (valor, data, forma_pagamento) VALUES ($1, NOW(), $2)",
                    [valor, pag]
                );
            }
        }

        await client.query("DELETE FROM pedido_itens WHERE pedido_id = $1", [id]);
        await client.query("DELETE FROM pedidos WHERE id = $1", [id]);
        
        await client.query("COMMIT");
        res.sendStatus(204);
    } catch (err: any) {
        await client.query("ROLLBACK");
        res.status(500).json({ erro: err.message });
    } finally {
        client.release();
    }
});

// =============================================================
//  OUTRAS ROTAS (VENDAS, PRODUTOS, CLIENTES)
// =============================================================

app.get("/vendas", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM historico_vendas ORDER BY data DESC");
        res.json(result.rows);
    } catch (err: any) { res.status(500).json({ erro: err.message }); }
});

// Rotas de Clientes (Via Service - mantido pois funcionava)
app.post("/clientes", async (req, res) => { 
    try { const r = await clienteService.adicionarCliente({id:0, ...req.body}); res.status(201).json(r); } catch (e:any) { res.status(500).json({erro:e.message}); } 
});
app.post("/clientes/login", async (req, res) => {
    try { 
        const cs = await clienteService.listarClientes(); 
        const c = cs.find(x => x.telefone === req.body.telefone);
        c ? res.json({cliente:c}) : res.status(404).json({erro:"Cliente não encontrado"});
    } catch (e:any) { res.status(500).json({erro:e.message}); }
});

// Rotas de Produtos (Via Service ou Query Simples)
app.get("/produtos", async (req, res) => { const r = await pool.query("SELECT * FROM produtos ORDER BY id ASC"); res.json(r.rows); });
app.post("/produtos", async (req, res) => { const {nome, valor, tipo} = req.body; const r = await pool.query("INSERT INTO produtos (nome, valor, tipo) VALUES ($1,$2,$3) RETURNING id", [nome,valor,tipo]); res.json({id:r.rows[0].id}); });
app.put("/produtos/:id", async (req, res) => { await pool.query("UPDATE produtos SET nome=$1, valor=$2, tipo=$3 WHERE id=$4", [req.body.nome, req.body.valor, req.body.tipo, req.params.id]); res.json({ok:true}); });
app.delete("/produtos/:id", async (req, res) => { try { await pool.query("DELETE FROM produtos WHERE id=$1", [req.params.id]); res.sendStatus(204); } catch { res.status(400).json({erro:"Erro ao deletar"}); } });

const PORT = 3000;
app.listen(PORT, () => console.log(`🔥 Servidor (MODO DIRETO) rodando em http://localhost:${PORT}`));