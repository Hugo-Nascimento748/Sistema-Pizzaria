// src/repositories/ProdutoRepository.ts
import { pool } from "../database/db";
import { Produto } from "../models/Produto";

export class ProdutoRepository {

    static async criar(produto: Produto) {
        const query = `INSERT INTO produtos (nome, valor, tipo) VALUES ($1, $2, $3) RETURNING *;`;
        const { rows } = await pool.query(query, [produto.nome, produto.valor, produto.tipo]);
        const p = rows[0];
        p.valor = Number(p.valor);
        return p;
}


    
    static async listar(): Promise<Produto[]> {
        const { rows } = await pool.query("SELECT id, nome, valor, tipo FROM produtos ORDER BY id;");
        return rows.map((r: any) => ({
            id: r.id,
            nome: r.nome,
            valor: Number(r.valor), // ou parseFloat(r.valor)
            tipo: r.tipo
        }));
}


    static async remover(id: number) {
        await pool.query("DELETE FROM produtos WHERE id = $1;", [id]);
    }

    static async atualizar(id: number, dados: Partial<Produto>) {
        const campos = [];
        const valores = [];
        let i = 1;

        for (const key in dados) {
            campos.push(`${key} = $${i}`);
            valores.push((dados as any)[key]);
            i++;
        }

        valores.push(id);

        await pool.query(`
            UPDATE produtos SET ${campos.join(", ")}
            WHERE id = $${i};
        `, valores);
    }
}
