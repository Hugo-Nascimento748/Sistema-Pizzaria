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
exports.PedidoService = void 0;
// src/services/PedidoService.ts
const PedidoRepository_1 = require("../repositories/PedidoRepository");
class PedidoService {
    criarPedido(clienteId, produtos) {
        return __awaiter(this, void 0, void 0, function* () {
            const pedidoId = yield PedidoRepository_1.PedidoRepository.criar(clienteId, produtos);
            // Busca o pedido completo já formatado
            const pedido = yield PedidoRepository_1.PedidoRepository.detalhar(pedidoId);
            if (!pedido) {
                throw new Error("Erro interno: pedido criado mas não encontrado.");
            }
            return pedido;
        });
    }
    listarPedidos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PedidoRepository_1.PedidoRepository.listar();
        });
    }
    removerPedido(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield PedidoRepository_1.PedidoRepository.remover(id);
        });
    }
    detalharPedido(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PedidoRepository_1.PedidoRepository.detalhar(id);
        });
    }
}
exports.PedidoService = PedidoService;
