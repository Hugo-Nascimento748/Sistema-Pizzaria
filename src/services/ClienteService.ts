import { Cliente } from "../models/Cliente"

export class ClienteService {

    private contadorId: number = 1;
    private clientes: Cliente[] = [];

    adicionarCliente(cliente: Cliente){
        cliente.id = this.contadorId;
        this.contadorId++;
        this.clientes.push(cliente);
        console.log(`Cliente ${cliente.nome} adicionado com sucesso!`);
    }

    removerCliente(id: number){
        this.clientes = this.clientes.filter(c => c.id !== id);
    }

    listarClientes(): Cliente[] {
        return this.clientes;
    }

    editarCliente(id: number, dadosAtualizados: Partial<Cliente>) {

        const cliente = this.clientes.find(c => c.id === id);
        if (cliente) {
            Object.assign(cliente, dadosAtualizados);
            console.log(`Cliente ${id} atualizado com sucesso!`);
        }
        
        else {
            console.log(`Cliente não encontrado!`);
        }
    
    } 
}