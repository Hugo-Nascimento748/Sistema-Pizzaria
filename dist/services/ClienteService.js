"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteService = void 0;
class ClienteService {
    constructor() {
        this.contadorId = 1;
        this.clientes = [];
    }
    adicionarCliente(cliente) {
        cliente.id = this.contadorId;
        this.contadorId++;
        this.clientes.push(cliente);
        console.log(`Cliente ${cliente.nome} adicionado com sucesso!`);
    }
    removerCliente(id) {
        this.clientes = this.clientes.filter(c => c.id !== id);
    }
    listarClientes() {
        return this.clientes;
    }
    editarCliente(id, dadosAtualizados) {
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
exports.ClienteService = ClienteService;
