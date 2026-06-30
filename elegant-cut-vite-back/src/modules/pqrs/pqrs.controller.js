"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PqrsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var PqrsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('PQRS - Peticiones, Quejas, Reclamos y Sugerencias'), (0, common_1.Controller)('pqrs')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _crearPqrs_decorators;
    var _obtenerPqrs_decorators;
    var _findByRadicado_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var PqrsController = _classThis = /** @class */ (function () {
        function PqrsController_1(pqrsService) {
            this.pqrsService = (__runInitializers(this, _instanceExtraInitializers), pqrsService);
        }
        PqrsController_1.prototype.crearPqrs = function (crearPqrsDto) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.pqrsService.create(crearPqrsDto)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_1 = _a.sent();
                            console.error('Error creando PQRS:', error_1);
                            return [2 /*return*/, {
                                    statusCode: 500,
                                    message: 'Internal server error',
                                    errorDetail: error_1 instanceof Error ? error_1.message : String(error_1),
                                    stack: error_1 instanceof Error ? error_1.stack : undefined,
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        PqrsController_1.prototype.obtenerPqrs = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.pqrsService.obtenerPqrs()];
                });
            });
        };
        PqrsController_1.prototype.findByRadicado = function (radicado) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.pqrsService.findByRadicado(radicado)];
                });
            });
        };
        // --- MÉTODOS CRUD ADMINISTRATIVOS ---
        PqrsController_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.pqrsService.findOne(id)];
                });
            });
        };
        PqrsController_1.prototype.update = function (id, updatePqrsDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.pqrsService.update(id, updatePqrsDto)];
                });
            });
        };
        return PqrsController_1;
    }());
    __setFunctionName(_classThis, "PqrsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _crearPqrs_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Crear una nueva PQRS',
                description: 'Permite a clientes o visitantes registrar una Petición, Queja, Reclamo o Sugerencia.',
            }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'La solicitud se ha registrado exitosamente.',
            }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Error al crear la pqrs' }), (0, common_1.Post)()];
        _obtenerPqrs_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, roles_decorator_1.Roles)(1), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, swagger_1.ApiOperation)({
                summary: 'Obtener todas las PQRS',
                description: 'Devuelve todas las solicitudes PQRS registradas en la base de datos (Para el panel de Admin).',
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'PQRS encontrada exitosamente' }), (0, swagger_1.ApiNotFoundResponse)({
                description: 'No se encontro la PQRS con el ID proporcionado',
            }), (0, common_1.Get)()];
        _findByRadicado_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Consultar estado por radicado',
                description: 'Permite buscar el estado de una PQRS usando su código de radicado (ej: PQRS-12-2024).',
            }), (0, swagger_1.ApiParam)({
                name: 'radicado',
                description: 'Número de radicado',
                example: 'PQRS-1-2026',
            }), (0, common_1.Get)('status/:radicado')];
        _findOne_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, roles_decorator_1.Roles)(1), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, swagger_1.ApiOperation)({
                summary: 'Obtener detalle de una queja o reclamo',
                description: 'Devuelve toda la información de una PQRS específica incluyendo datos del usuario asociado.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la PQRS', example: 1 }), (0, common_1.Get)(':id')];
        _update_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, roles_decorator_1.Roles)(1), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, swagger_1.ApiOperation)({
                summary: 'Responder y/o actualizar una PQRS',
                description: 'Permite al administrador enviar la respuesta o cambiar el estado de la queja de Pendiente a Resuelto.',
            }), (0, swagger_1.ApiParam)({
                name: 'id',
                description: 'ID de la PQRS a responder',
                example: 1,
            }), (0, swagger_1.ApiResponse)({ status: 200, description: 'PQRS actualizada exitosamente.' }), (0, common_1.Patch)(':id')];
        __esDecorate(_classThis, null, _crearPqrs_decorators, { kind: "method", name: "crearPqrs", static: false, private: false, access: { has: function (obj) { return "crearPqrs" in obj; }, get: function (obj) { return obj.crearPqrs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _obtenerPqrs_decorators, { kind: "method", name: "obtenerPqrs", static: false, private: false, access: { has: function (obj) { return "obtenerPqrs" in obj; }, get: function (obj) { return obj.obtenerPqrs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByRadicado_decorators, { kind: "method", name: "findByRadicado", static: false, private: false, access: { has: function (obj) { return "findByRadicado" in obj; }, get: function (obj) { return obj.findByRadicado; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PqrsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PqrsController = _classThis;
}();
exports.PqrsController = PqrsController;
