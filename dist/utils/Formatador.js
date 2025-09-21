"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatarMoeda = formatarMoeda;
exports.formatarData = formatarData;
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}
function formatarData(data) {
    return data.toLocaleDateString("pt-BR");
}
