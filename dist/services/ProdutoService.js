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
exports.ProdutoService = void 0;
const ProdutoRepository_1 = require("../repositories/ProdutoRepository");
class ProdutoService {
    adicionarProduto(produto) {
        return __awaiter(this, void 0, void 0, function* () {
            const novo = yield ProdutoRepository_1.ProdutoRepository.criar(produto);
            console.log(`Produto ${novo.nome} adicionado ao banco!`);
            return novo;
        });
    }
    listarProdutos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProdutoRepository_1.ProdutoRepository.listar();
        });
    }
    removerProduto(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ProdutoRepository_1.ProdutoRepository.remover(id);
            console.log(`Produto ${id} removido.`);
        });
    }
    editarProduto(id, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ProdutoRepository_1.ProdutoRepository.atualizar(id, dados);
            console.log(`Produto ${id} atualizado.`);
        });
    }
}
exports.ProdutoService = ProdutoService;
