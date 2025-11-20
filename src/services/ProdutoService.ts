// src/services/ProdutoService.ts
import { Produto } from "../models/Produto";
import { ProdutoRepository } from "../repositories/ProdutoRepository";

export class ProdutoService {

    async adicionarProduto(produto: Produto) {
        const novo = await ProdutoRepository.criar(produto);
        console.log(`Produto ${novo.nome} adicionado ao banco!`);
        return novo;
    }

    async listarProdutos() {
        return await ProdutoRepository.listar();
    }

    async removerProduto(id: number) {
        await ProdutoRepository.remover(id);
        console.log(`Produto ${id} removido.`);
    }

    async editarProduto(id: number, dados: Partial<Produto>) {
        await ProdutoRepository.atualizar(id, dados);
        console.log(`Produto ${id} atualizado.`);
    }
}
