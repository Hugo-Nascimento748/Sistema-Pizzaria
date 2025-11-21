import express, { Request, Response } from "express";
import cors from "cors";
import { pool } from "./database/db"; 
import { PedidoService } from "./services/PedidoService";
import { ProdutoService } from "./services/ProdutoService";
import { ClienteService } from "./services/ClienteService";

const app = express();

// --- CONFIGURAÇÃO DE CORS (LIBERA O FRONTEND) ---
app.use(cors({
    origin: '*', // Aceita requisições de qualquer lugar (navegador)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'usuario', 'senha']
}));

app.use(express.json());

const pedidoService = new PedidoService();
const produtoService = new ProdutoService();
const clienteService = new ClienteService();

// ==========================================
// ROTAS DE CLIENTES (LOGIN E CADASTRO)
// ==========================================
app.post("/clientes", async (req: Request, res: Response) => { 
    const { nome, endereco, telefone } = req.body; 
    try {
        const result = await clienteService.adicionarCliente({ id:0, nome, endereco, telefone });
        res.status(201).json(result);
    } catch (err: any) {
        res.status(500).json({ erro: err.message });
    }
});

app.post("/clientes/login", async (req: Request, res: Response) => {
    const { telefone } = req.body;
    try {
        const clientes = await clienteService.listarClientes();
        const cliente = clientes.find(c => c.telefone === telefone);
        if (!cliente) return res.status(404).json({ erro: "Cliente não encontrado" });
        res.json({ mensagem: "Login OK", clienteId: cliente.id, cliente });
    } catch (err: any) {
        res.status(500).json({ erro: err.message });
    }
});

// ==========================================
// ROTAS DE PEDIDOS (CRIAR, LISTAR, DETALHAR)
// ==========================================
app.get("/pedidos", async (req: Request, res: Response) => {
    try { res.json(await pedidoService.listarPedidos()); } 
    catch (err: any) { res.status(500).json({ erro: err.message }); }
});

app.get("/pedidos/:id", async (req: Request, res: Response) => {
    try {
        const pedido = await pedidoService.detalharPedido(Number(req.params.id));
        if (!pedido) return res.status(404).json({ erro: "Pedido não encontrado" });
        res.json(pedido);
    } catch (err: any) { res.status(500).json({ erro: err.message }); }
});

app.post("/pedidos", async (req: Request, res: Response) => {
    const { clienteId, produtos } = req.body;
    console.log("📦 Recebendo pedido:", req.body); // Log para debug

    try {
        if (!clienteId || !produtos || produtos.length === 0) {
            return res.status(400).json({ erro: "Dados inválidos (cliente ou produtos faltando)" });
        }
        
        const pedidoId = await pedidoService.criarPedido(clienteId, produtos);
        res.status(201).json({ mensagem: "Pedido criado", pedidoId });
    } catch (err: any) {
        console.error("❌ Erro ao criar pedido:", err);
        res.status(500).json({ erro: err.message }); 
    }
});

// ==========================================
// ROTA ESPECIAL: DELETAR PEDIDO + SALVAR NO HISTÓRICO
// ==========================================
app.delete("/pedidos/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // 1. Salva no histórico
        const resConsulta = await client.query("SELECT valor_total FROM pedidos WHERE id = $1", [id]);
        if (resConsulta.rows.length > 0) {
            const valor = Number(resConsulta.rows[0].valor_total);
            if (!isNaN(valor) && valor > 0) {
                await client.query("INSERT INTO historico_vendas (valor, data) VALUES ($1, NOW())", [valor]);
            }
        }

        // 2. Deleta
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

// ==========================================
// ROTAS DE HISTÓRICO E VENDAS
// ==========================================
app.get("/vendas", async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM historico_vendas ORDER BY data DESC");
        res.json(result.rows);
    } catch (err: any) { res.status(500).json({ erro: err.message }); }
});

// ==========================================
// ROTAS DE PRODUTOS (CRUD COMPLETO)
// ==========================================
app.get("/produtos", async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM produtos ORDER BY id ASC");
        res.json(result.rows);
    } catch (err: any) { res.status(500).json({ erro: err.message }); }
});

app.post("/produtos", async (req: Request, res: Response) => {
    const { nome, valor, tipo } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO produtos (nome, valor, tipo) VALUES ($1, $2, $3) RETURNING id",
            [nome, valor, tipo]
        );
        res.status(201).json({ id: result.rows[0].id, nome, valor, tipo });
    } catch (err: any) { res.status(500).json({ erro: err.message }); }
});

app.put("/produtos/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { nome, valor, tipo } = req.body;
    try {
        await pool.query("UPDATE produtos SET nome = $1, valor = $2, tipo = $3 WHERE id = $4", [nome, valor, tipo, id]);
        res.json({ mensagem: "Produto atualizado" });
    } catch (err: any) { res.status(500).json({ erro: err.message }); }
});

app.delete("/produtos/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
        await pool.query("DELETE FROM produtos WHERE id = $1", [id]);
        res.sendStatus(204);
    } catch (err: any) {
        if (err.code === '23503') res.status(400).json({ erro: "Produto em uso." });
        else res.status(500).json({ erro: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando em http://localhost:${PORT}`));