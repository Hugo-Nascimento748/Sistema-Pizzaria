import { Cliente } from "./Cliente";
import { Produto } from "./Produto";

export interface Pedido {
    id: number;
    cliente: Cliente;
    data: Date;
    valorTotal: number;
    status?: string;
    formaPagamento?: string;
    produtos: {
        id: number;
        nome: string;
        tipo: string;
        valor: number;
        quantidade: number;
    }[];
}
