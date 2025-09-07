import { Pedido } from "../models/Pedido";
import { Produto } from "../models/Produto";
import { Cliente } from "../models/Cliente";

export class PedidoService{
    private pedidos: Pedido[] = [];
    private contadorId: number = 1;

    adicionarPedido(cliente: Cliente, produtos: Produto[]){
        let valorTotal = 0;
        for (let i = 0; i < produtos.length; i++) {
            valorTotal += produtos[1].valor;            
        }
        console.log(`Valor Total: $${valorTotal}`);

        const pedido: Pedido = {
            id: this.contadorId,
            cliente: cliente,
            data: new Date(),
            valorTotal: valorTotal,
            produtos: produtos
        };

        this.contadorId++;
        this.pedidos.push(pedido);
        console.log(`O produto do cliente ${cliente.nome} foi adicionado. Valor Total: $${valorTotal}`);

    }

    listarPedidos(): Pedido[]{
        return this.pedidos;
    }

    removerPedido(id: number){
        this.pedidos = this.pedidos.filter(p => p.id !== id);
    }

    editarPedido(id: number, dadosAtualizados: Partial<Pedido>){
        const pedido = this.pedidos.find(p => p.id === id);
        if(pedido){
            Object.assign(pedido, dadosAtualizados);
            console.log(`Dados atualizados.`);
        }
        else {
            console.log(`Pedido não encontrado!`);
        }
    }
}