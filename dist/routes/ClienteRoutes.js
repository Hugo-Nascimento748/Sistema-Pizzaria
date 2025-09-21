"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/ClienteRoutes.ts
const express_1 = require("express");
const ClienteController_1 = require("../controllers/ClienteController");
const router = (0, express_1.Router)();
router.post("/", ClienteController_1.criarCliente);
router.get("/", ClienteController_1.listarClientes);
router.get("/:id", ClienteController_1.buscarCliente);
router.put("/:id", ClienteController_1.atualizarCliente);
router.delete("/:id", ClienteController_1.excluirCliente);
exports.default = router;
