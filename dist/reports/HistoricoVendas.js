"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricoVendas = void 0;
const fs = require("fs");
const Formatador_1 = require("../utils/Formatador");
class HistoricoVendas {
    static registrar(pedido) {
        const existe = fs.existsSync(this.caminho);
        // Criar cabeçalho se o arquivo ainda não existir
        if (!existe) {
            fs.writeFileSync(this.caminho, "Data,Cliente,Produtos,Valor Total\n", { encoding: "utf-8" });
        }
        // ✅ Ajustado para seu modelo de Pedido
        const data = (0, Formatador_1.formatarData)(new Date(pedido.data));
        const cliente = pedido.cliente.nome;
        const produtos = pedido.produtos
            .map((produto) => produto.nome)
            .join(" | ");
        const valorTotal = (0, Formatador_1.formatarMoeda)(pedido.valorTotal);
        fs.appendFileSync(this.caminho, `${data},${cliente},"${produtos}",${valorTotal}\n`, { encoding: "utf-8" });
    }
    static listar() {
        if (!fs.existsSync(this.caminho)) {
            return "Nenhum histórico de vendas encontrado.";
        }
        return fs.readFileSync(this.caminho, { encoding: "utf-8" });
    }
}
exports.HistoricoVendas = HistoricoVendas;
HistoricoVendas.caminho = "historico_vendas.csv";
