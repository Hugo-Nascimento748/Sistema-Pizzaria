import { Pool } from "pg";

export const pool = new Pool({
    user: "pizzaria",
    password: "102030",
    host: "localhost",
    port: 5432,
    database: "db_hugo"
});

export async function conectar() {
    try {
        await pool.connect();
        console.log("Banco conectado com sucesso!");
    } catch (error) {
        console.error("Erro ao conectar ao banco:", error);
    }
}
