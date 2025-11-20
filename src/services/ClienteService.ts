// src/services/ClienteService.ts
import { ClienteRepository } from "../repositories/ClientRepository";
import { Cliente } from "../models/Cliente";

export class ClienteService {

    async adicionarCliente(cliente: Cliente) {
        const novo = await ClienteRepository.criar(cliente);
        console.log(`Cliente ${novo.nome} registrado no banco!`);
        return novo;
    }

    async listarClientes() {
        return await ClienteRepository.listar();
    }

    async removerCliente(id: number) {
        await ClienteRepository.remover(id);
        console.log(`Cliente ${id} removido.`);
    }

    async editarCliente(id: number, dados: Partial<Cliente>) {
        await ClienteRepository.atualizar(id, dados);
        console.log(`Cliente ${id} atualizado.`);
    }
}
