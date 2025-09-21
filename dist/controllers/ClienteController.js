"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarCliente = criarCliente;
exports.listarClientes = listarClientes;
exports.buscarCliente = buscarCliente;
exports.atualizarCliente = atualizarCliente;
exports.excluirCliente = excluirCliente;
const clienteService = require("../services/ClienteService");
function criarCliente(req, res) {
    const novoCliente = clienteService.criarCliente(req.body);
    res.status(201).json(novoCliente);
}
function listarClientes(req, res) {
    const clientes = clienteService.listarClientes();
    res.json(clientes);
}
function buscarCliente(req, res) {
    const id = Number(req.params.id);
    const cliente = clienteService.buscarClientePorId(id);
    if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.json(cliente);
}
function atualizarCliente(req, res) {
    const id = Number(req.params.id);
    const atualizado = clienteService.atualizarCliente(id, req.body);
    if (!atualizado) {
        return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.json(atualizado);
}
function excluirCliente(req, res) {
    const id = Number(req.params.id);
    const excluido = clienteService.excluirCliente(id);
    if (!excluido) {
        return res.status(404).json({ message: "Cliente não encontrado" });
    }
    res.status(204).send();
}
