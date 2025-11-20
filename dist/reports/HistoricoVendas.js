"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricoVendas = void 0;
// src/reports/HistoricoVendas.ts
const HistoricoVendasRepository_1 = require("../repositories/HistoricoVendasRepository");
const Formatador_1 = require("../utils/Formatador");
class HistoricoVendas {
    static listarFormatado() {
        return __awaiter(this, void 0, void 0, function* () {
            const pedidos = yield HistoricoVendasRepository_1.HistoricoVendasRepository.listar();
            if (pedidos.length === 0)
                return "Nenhuma venda registrada.";
            return pedidos.map(p => {
                const produtos = p.produtos.map(pr => `${pr.nome} (x${pr.quantidade})`).join(" | ");
                return `${(0, Formatador_1.formatarData)(p.data)}  
Cliente: ${p.cliente.nome}  
Produtos: ${produtos}  
Total: ${(0, Formatador_1.formatarMoeda)(p.valorTotal)}\n-----------------------------`;
            }).join("\n");
        });
    }
}
exports.HistoricoVendas = HistoricoVendas;
