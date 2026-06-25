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
exports.ReviewsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var ReviewsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Reviews - Reseñas'), (0, common_1.Controller)('reviews')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _obtenerResenas_decorators;
    var _getBarberReviews_decorators;
    var _getAdminReviews_decorators;
    var _create_decorators;
    var _changeStatus_decorators;
    var _remove_decorators;
    var ReviewsController = _classThis = /** @class */ (function () {
        function ReviewsController_1(reviewsService) {
            this.reviewsService = (__runInitializers(this, _instanceExtraInitializers), reviewsService);
        }
        // este es el del ejemplo de prisma
        ReviewsController_1.prototype.obtenerResenas = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.obtenerResenas()];
                });
            });
        };
        ReviewsController_1.prototype.getBarberReviews = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.findBarberReviews(id)];
                });
            });
        };
        ReviewsController_1.prototype.getAdminReviews = function (status) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.findAllAdmin(status)];
                });
            });
        };
        ReviewsController_1.prototype.create = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.reviewsService.create(data)];
                        case 1: return [2 /*return*/, _a.sent()];
                        case 2:
                            error_1 = _a.sent();
                            console.error('ERROR CREANDO RESEÑA:', error_1);
                            throw error_1; // Dejar que Nest lo maneje pero ya lo logueamos en el contenedor
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // --- MÉTODOS DE ACCIÓN ADMINISTRATIVA ---
        ReviewsController_1.prototype.changeStatus = function (id, estado) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.changeStatusAdmin(id, estado)];
                });
            });
        };
        ReviewsController_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reviewsService.deleteAdmin(id)];
                });
            });
        };
        return ReviewsController_1;
    }());
    __setFunctionName(_classThis, "ReviewsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _obtenerResenas_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Obtener todas las reseñas',
                description: 'Devuelve todas las reseñas o calificaciones registradas.',
            }), (0, common_1.Get)()];
        _getBarberReviews_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Obtener reseñas por barbero',
                description: 'Devuelve las reseñas aprobadas para un barbero específico.',
            }), (0, common_1.Get)('barber/:id')];
        _getAdminReviews_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, roles_decorator_1.Roles)(1), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, swagger_1.ApiOperation)({
                summary: 'Obtener reseñas para Admin',
                description: 'Listado completo para el panel de administración, opcionalmente filtrado por estado (approved/spam)',
            }), (0, common_1.Get)('admin/all')];
        _create_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOperation)({
                summary: 'Crear una nueva reseña',
                description: 'Registra una calificación/reseña de un cliente sobre su cita.',
            }), (0, swagger_1.ApiBody)({
                schema: {
                    type: 'object',
                    properties: {
                        calificacion: { type: 'number', example: 5 },
                        comentario: { type: 'string', example: 'Excelente servicio' },
                        id_cita: { type: 'number', example: 10 },
                    },
                },
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Reseña creada exitosamente.' }), (0, common_1.Post)()];
        _changeStatus_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, roles_decorator_1.Roles)(1), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, swagger_1.ApiOperation)({
                summary: 'Cambiar estado de reseña',
                description: 'Permite al admin aprobar (1) o marcar como spam (0) una reseña específica.',
            }), (0, common_1.Patch)('admin/:id/status')];
        _remove_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, roles_decorator_1.Roles)(1), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, swagger_1.ApiOperation)({
                summary: 'Eliminar reseña definitivamente',
                description: 'Borra de manera permanente una reseña ofensiva o equivocada de la base de datos.',
            }), (0, common_1.Delete)('admin/:id')];
        __esDecorate(_classThis, null, _obtenerResenas_decorators, { kind: "method", name: "obtenerResenas", static: false, private: false, access: { has: function (obj) { return "obtenerResenas" in obj; }, get: function (obj) { return obj.obtenerResenas; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBarberReviews_decorators, { kind: "method", name: "getBarberReviews", static: false, private: false, access: { has: function (obj) { return "getBarberReviews" in obj; }, get: function (obj) { return obj.getBarberReviews; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAdminReviews_decorators, { kind: "method", name: "getAdminReviews", static: false, private: false, access: { has: function (obj) { return "getAdminReviews" in obj; }, get: function (obj) { return obj.getAdminReviews; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changeStatus_decorators, { kind: "method", name: "changeStatus", static: false, private: false, access: { has: function (obj) { return "changeStatus" in obj; }, get: function (obj) { return obj.changeStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReviewsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReviewsController = _classThis;
}();
exports.ReviewsController = ReviewsController;
