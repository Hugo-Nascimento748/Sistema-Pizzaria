import * as fs from "fs";
import { Pedido } from "../models/Pedido";
import { formatarData, formatarMoeda } from "../utils/Formatador";

export class HistoricoVendas {
    private static caminho = "historico_vendas.csv";

    static registrar(pedido: Pedido) {
        const existe = fs.existsSync(this.caminho);

        // Criar cabeçalho se o arquivo ainda não existir
        if (!existe) {
            fs.writeFileSync(
                this.caminho,
                "Data,Cliente,Produtos,Valor Total\n",
                { encoding: "utf-8" }
            );
        }

        // ✅ Ajustado para seu modelo de Pedido
        const data = formatarData(new Date(pedido.data));
        const cliente = pedido.cliente.nome;
        const produtos = pedido.produtos
            .map((produto: any) => produto.nome)
            .join(" | ");
        const valorTotal = formatarMoeda(pedido.valorTotal);

        fs.appendFileSync(
            this.caminho,
            `${data},${cliente},"${produtos}",${valorTotal}\n`,
            { encoding: "utf-8" }
        );
    }

    static listar(): string {
        if (!fs.existsSync(this.caminho)) {
            return "Nenhum histórico de vendas encontrado.";
        }
        return fs.readFileSync(this.caminho, { encoding: "utf-8" });
    }
}
