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
exports.ClienteService = void 0;
// src/services/ClienteService.ts
const ClientRepository_1 = require("../repositories/ClientRepository");
class ClienteService {
    adicionarCliente(cliente) {
        return __awaiter(this, void 0, void 0, function* () {
            const novo = yield ClientRepository_1.ClienteRepository.criar(cliente);
            console.log(`Cliente ${novo.nome} registrado no banco!`);
            return novo;
        });
    }
    listarClientes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ClientRepository_1.ClienteRepository.listar();
        });
    }
    removerCliente(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ClientRepository_1.ClienteRepository.remover(id);
            console.log(`Cliente ${id} removido.`);
        });
    }
    editarCliente(id, dados) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ClientRepository_1.ClienteRepository.atualizar(id, dados);
            console.log(`Cliente ${id} atualizado.`);
        });
    }
}
exports.ClienteService = ClienteService;
