import { Produto } from "../models/Produto";

export class ProdutoService {
    private produtos: Produto[] = [];
    private contadorId: number = 1;

    adicionarProduto(produto: Produto) {

        produto.id = this.contadorId;
        this.contadorId++;
        this.produtos.push(produto);
        console.log(`Produto ${produto.nome} adicionado com sucesso!`);
    
    }
    removerProduto(id: number){
        this.produtos = this.produtos.filter(p => p.id !== id);
    }

    editarProduto(id: number, dadosAtualizados: Partial<Produto>){
        const produto = this.produtos.find(p => p.id === id)
        if (produto){
            Object.assign(produto, dadosAtualizados);
            console.log(`Produto com id ${id} atualizado com sucesso!`);
        }
        else {
            console.log(`Produto não encontrado!`);
        }
    }
    listarProduto(): Produto[]{
        return this.produtos;
    }
}