"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendasMensais = void 0;
var VendasMensais = /** @class */ (function () {
    function VendasMensais() {
    }
    VendasMensais.gerar = function (pedidos) {
        var data = new Date();
        var mes = data.getMonth();
        var ano = data.getFullYear();
        var pedidosMes = pedidos.filter(function (pedido) {
            return (data.getMonth() === mes &&
                data.getFullYear() === ano);
        });
        var faturamento = 0;
        for (var i = 0; i < pedidosMes.length; i++) {
            faturamento += pedidosMes[i].valorTotal;
        }
        var quantidadePedidosMes = pedidosMes.length;
        console.log("================================");
        console.log("Vendas no m\u00EAs: ".concat(quantidadePedidosMes));
        console.log("Faturamento do m\u00EAs: $".concat(faturamento));
        console.log("================================");
    };
    return VendasMensais;
}());
exports.VendasMensais = VendasMensais;
