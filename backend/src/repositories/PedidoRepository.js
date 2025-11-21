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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidoRepository = void 0;
var db_1 = require("../database/db");
var PedidoRepository = /** @class */ (function () {
    function PedidoRepository() {
    }
    // 📌 LISTAR TODOS (resumido)
    PedidoRepository.listar = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            SELECT \n                p.id AS pedido_id,\n                p.data,\n                c.id AS cliente_id,\n                c.nome AS cliente_nome,\n                c.telefone,\n                c.endereco,\n                COALESCE(SUM(pr.valor * i.quantidade), 0) AS total\n            FROM pedidos p\n            JOIN clientes c ON c.id = p.cliente_id\n            LEFT JOIN pedido_itens i ON i.pedido_id = p.id\n            LEFT JOIN produtos pr ON pr.id = i.produto_id\n            GROUP BY p.id, c.id\n            ORDER BY p.id;\n        ";
                        return [4 /*yield*/, db_1.pool.query(query)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows.map(function (r) { return ({
                                id: r.pedido_id,
                                data: new Date(r.data),
                                valorTotal: Number(r.total),
                                cliente: {
                                    id: r.cliente_id,
                                    nome: r.cliente_nome,
                                    telefone: r.telefone,
                                    endereco: r.endereco
                                },
                                produtos: [] // carregados só no detalhar
                            }); })];
                }
            });
        });
    };
    // 📌 DETALHAR UM PEDIDO
    PedidoRepository.detalhar = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            SELECT \n                p.id AS pedido_id,\n                p.data,\n                c.id AS cliente_id,\n                c.nome AS cliente_nome,\n                c.telefone,\n                c.endereco,\n                pr.id AS produto_id,\n                pr.nome AS produto_nome,\n                pr.valor,\n                pr.tipo,\n                i.quantidade\n            FROM pedidos p\n            JOIN clientes c ON c.id = p.cliente_id\n            JOIN pedido_itens i ON i.pedido_id = p.id\n            JOIN produtos pr ON pr.id = i.produto_id\n            WHERE p.id = $1;\n        ";
                        return [4 /*yield*/, db_1.pool.query(query, [id])];
                    case 1:
                        rows = (_a.sent()).rows;
                        if (rows.length === 0)
                            return [2 /*return*/, null];
                        p = rows[0];
                        return [2 /*return*/, {
                                id: p.pedido_id,
                                data: new Date(p.data),
                                valorTotal: rows.reduce(function (t, r) { return t + Number(r.valor) * Number(r.quantidade); }, 0),
                                cliente: {
                                    id: p.cliente_id,
                                    nome: p.cliente_nome,
                                    telefone: p.telefone,
                                    endereco: p.endereco
                                },
                                produtos: rows.map(function (r) { return ({
                                    id: r.produto_id,
                                    nome: r.produto_nome,
                                    valor: Number(r.valor),
                                    tipo: r.tipo,
                                    quantidade: Number(r.quantidade)
                                }); })
                            }];
                }
            });
        });
    };
    // 📌 CRIAR PEDIDO — calculando pelo banco
    PedidoRepository.criar = function (clienteId, produtos) {
        return __awaiter(this, void 0, void 0, function () {
            var client, ids, produtosDb, total, _loop_1, _i, produtos_1, item, pedidoInsert, pedidoId, _a, produtos_2, p, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, db_1.pool.connect()];
                    case 1:
                        client = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 11, 13, 14]);
                        return [4 /*yield*/, client.query("BEGIN")];
                    case 3:
                        _b.sent();
                        ids = produtos.map(function (p) { return p.id; });
                        return [4 /*yield*/, client.query("SELECT id, valor FROM produtos WHERE id = ANY($1);", [ids])];
                    case 4:
                        produtosDb = _b.sent();
                        if (produtosDb.rows.length !== produtos.length) {
                            throw new Error("Alguns produtos enviados não existem no banco.");
                        }
                        total = 0;
                        _loop_1 = function (item) {
                            var produtoBanco = produtosDb.rows.find(function (p) { return p.id === item.id; });
                            total += Number(produtoBanco.valor) * item.quantidade;
                        };
                        for (_i = 0, produtos_1 = produtos; _i < produtos_1.length; _i++) {
                            item = produtos_1[_i];
                            _loop_1(item);
                        }
                        return [4 /*yield*/, client.query("INSERT INTO pedidos (cliente_id, data, valor_total)\n                 VALUES ($1, NOW(), $2)\n                 RETURNING id;", [clienteId, total])];
                    case 5:
                        pedidoInsert = _b.sent();
                        pedidoId = pedidoInsert.rows[0].id;
                        _a = 0, produtos_2 = produtos;
                        _b.label = 6;
                    case 6:
                        if (!(_a < produtos_2.length)) return [3 /*break*/, 9];
                        p = produtos_2[_a];
                        return [4 /*yield*/, client.query("INSERT INTO pedido_itens (pedido_id, produto_id, quantidade)\n                     VALUES ($1, $2, $3);", [pedidoId, p.id, p.quantidade])];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8:
                        _a++;
                        return [3 /*break*/, 6];
                    case 9: return [4 /*yield*/, client.query("COMMIT")];
                    case 10:
                        _b.sent();
                        return [2 /*return*/, pedidoId];
                    case 11:
                        err_1 = _b.sent();
                        return [4 /*yield*/, client.query("ROLLBACK")];
                    case 12:
                        _b.sent();
                        console.error("Erro ao criar pedido:", err_1);
                        throw err_1;
                    case 13:
                        client.release();
                        return [7 /*endfinally*/];
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    // 📌 REMOVER
    PedidoRepository.remover = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.pool.query("DELETE FROM pedido_itens WHERE pedido_id = $1", [id])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, db_1.pool.query("DELETE FROM pedidos WHERE id = $1", [id])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return PedidoRepository;
}());
exports.PedidoRepository = PedidoRepository;
