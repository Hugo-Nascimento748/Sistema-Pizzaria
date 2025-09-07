import { Cliente } from "./Cliente";
import { Produto } from "./Produto";

export interface Pedido {

    id: number;
    cliente: Cliente;
    data: Date;
    valorTotal: number;
    produto: Produto;

}