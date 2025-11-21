"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendasDiarias = void 0;
var VendasDiarias = /** @class */ (function () {
    function VendasDiarias() {
    }
    VendasDiarias.gerar = function (pedidos) {
        var hoje = new Date();
        var dia = hoje.getDate();
        var mes = hoje.getMonth();
        var ano = hoje.getFullYear();
        var pedidosHoje = pedidos.filter(function (pedido) {
            var data = pedido.data;
            return (data.getDate() === dia &&
                data.getMonth() === mes &&
                data.getFullYear() === ano);
        });
        var faturamento = 0;
        for (var i = 0; i < pedidos.length; i++) {
            faturamento += pedidosHoje[i].valorTotal;
        }
        var quantidadePedidos = pedidosHoje.length;
        console.log("=================================");
        console.log("Quantidade de pedidos do dia: ".concat(quantidadePedidos));
        console.log("Faturamento do dia: ".concat(faturamento));
        console.log("=================================");
    };
    return VendasDiarias;
}());
exports.VendasDiarias = VendasDiarias;
