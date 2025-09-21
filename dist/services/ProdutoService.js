"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoService = void 0;
class ProdutoService {
    constructor() {
        this.produtos = [];
        this.contadorId = 1;
    }
    adicionarProduto(produto) {
        produto.id = this.contadorId;
        this.contadorId++;
        this.produtos.push(produto);
        console.log(`Produto ${produto.nome} (${produto.tipo}) adicionado com sucesso!`);
    }
    editarProduto(id, dadosAtualizados) {
        const produto = this.produtos.find(p => p.id === id);
        if (produto) {
            Object.assign(produto, dadosAtualizados);
            console.log(`Produto com id ${id} atualizado com sucesso!`);
        }
        else {
            console.log(`Produto não encontrado!`);
        }
    }
    listarProduto() {
        return this.produtos;
    }
    removerProduto(id) {
        this.produtos = this.produtos.filter(p => p.id !== id);
        console.log(`Produto ${id} removido com sucesso!`);
    }
}
exports.ProdutoService = ProdutoService;
