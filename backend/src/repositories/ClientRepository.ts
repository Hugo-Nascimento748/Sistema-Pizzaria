// src/repositories/ClienteRepository.ts
import { pool } from "../database/db";
import { Cliente } from "../models/Cliente";

export class ClienteRepository {

    static async criar(cliente: Cliente) {
        const query = `
            INSERT INTO clientes (nome, telefone, endereco)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [cliente.nome, cliente.telefone, cliente.endereco];

        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async listar(): Promise<Cliente[]> {
        const { rows } = await pool.query("SELECT * FROM clientes ORDER BY id;");
        return rows;
    }

    static async remover(id: number) {
        await pool.query("DELETE FROM clientes WHERE id = $1;", [id]);
    }

    static async atualizar(id: number, dados: Partial<Cliente>) {
        const campos = [];
        const valores = [];
        let index = 1;

        for (const key in dados) {
            campos.push(`${key} = $${index}`);
            valores.push((dados as any)[key]);
            index++;
        }

        valores.push(id);

        await pool.query(`
            UPDATE clientes SET ${campos.join(", ")}
            WHERE id = $${index};
        `, valores);
    }
}
