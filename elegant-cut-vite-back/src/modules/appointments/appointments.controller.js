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
exports.AppointmentsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
// ─── SOLID: SRP ───────────────────────────────────────────────────────────────
// Controlador exclusivo para que los clientes vean disponibilidad, 
// reserven citas y vean sus propias reservas.
// ──────────────────────────────────────────────────────────────────────────────
var AppointmentsController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Appointments - Citas y Reservas'), (0, common_1.Controller)('appointments')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getHorarios_decorators;
    var _getRemindersTomorrow_decorators;
    var _getAvailability_decorators;
    var _getByBarber_decorators;
    var _createAppointment_decorators;
    var _getByUser_decorators;
    var _findOne_decorators;
    var AppointmentsController = _classThis = /** @class */ (function () {
        function AppointmentsController_1(appointmentsService) {
            this.appointmentsService = (__runInitializers(this, _instanceExtraInitializers), appointmentsService);
        }
        AppointmentsController_1.prototype.getHorarios = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appointmentsService.getHorarios()];
                });
            });
        };
        AppointmentsController_1.prototype.getRemindersTomorrow = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appointmentsService.getTomorrowReminders()];
                });
            });
        };
        AppointmentsController_1.prototype.getAvailability = function (date, barberId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appointmentsService.getAvailability(date, +barberId)];
                });
            });
        };
        AppointmentsController_1.prototype.getByBarber = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appointmentsService.getAppointmentsByBarber(+id)];
                });
            });
        };
        AppointmentsController_1.prototype.createAppointment = function (createAppointmentDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appointmentsService.createAppointment(createAppointmentDto)];
                });
            });
        };
        AppointmentsController_1.prototype.getByUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appointmentsService.getAppointmentsByUser(userId)];
                });
            });
        };
        AppointmentsController_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appointmentsService.findOne(id)];
                });
            });
        };
        return AppointmentsController_1;
    }());
    __setFunctionName(_classThis, "AppointmentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getHorarios_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Obtener todos los bloques de horarios',
                description: 'Devuelve la lista de bloques de tiempo disponibles.',
            }), (0, common_1.Get)('horarios')];
        _getRemindersTomorrow_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Obtener recordatorios para mañana',
                description: 'Devuelve una lista simplificada de citas de mañana para n8n.',
            }), (0, common_1.Get)('reminders/tomorrow')];
        _getAvailability_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Consultar disponibilidad',
                description: 'Devuelve los horarios disponibles para un barbero en una fecha específica.',
            }), (0, swagger_1.ApiQuery)({ name: 'date', description: 'Fecha a consultar (YYYY-MM-DD)', example: '2023-12-01' }), (0, swagger_1.ApiQuery)({ name: 'barberId', description: 'ID del barbero', example: '2' }), (0, common_1.Get)('availability')];
        _getByBarber_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Obtener citas por barbero',
                description: 'Devuelve la lista de citas asignadas a un barbero específico (Vista pública).',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del empleado/barbero', example: '2' }), (0, common_1.Get)('barber/:id')];
        _createAppointment_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOperation)({
                summary: 'Agendar nueva cita',
                description: 'Crea una nueva reserva de cita conectando a un cliente con un barbero.',
            }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Cita creada exitosamente.' }), (0, common_1.Post)()];
        _getByUser_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiOperation)({
                summary: 'Obtener todas las citas por usuario',
                description: 'Devuelve la lista de citas realizadas por un usuario (Mi perfil).',
            }), (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID del usuario', example: '1' }), (0, common_1.Get)('user/:userId')];
        _findOne_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Obtener detalle de una cita',
                description: 'Devuelve toda la información de una reserva específica.',
            }), (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la reserva', example: 1 }), (0, common_1.Get)(':id')];
        __esDecorate(_classThis, null, _getHorarios_decorators, { kind: "method", name: "getHorarios", static: false, private: false, access: { has: function (obj) { return "getHorarios" in obj; }, get: function (obj) { return obj.getHorarios; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRemindersTomorrow_decorators, { kind: "method", name: "getRemindersTomorrow", static: false, private: false, access: { has: function (obj) { return "getRemindersTomorrow" in obj; }, get: function (obj) { return obj.getRemindersTomorrow; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAvailability_decorators, { kind: "method", name: "getAvailability", static: false, private: false, access: { has: function (obj) { return "getAvailability" in obj; }, get: function (obj) { return obj.getAvailability; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getByBarber_decorators, { kind: "method", name: "getByBarber", static: false, private: false, access: { has: function (obj) { return "getByBarber" in obj; }, get: function (obj) { return obj.getByBarber; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createAppointment_decorators, { kind: "method", name: "createAppointment", static: false, private: false, access: { has: function (obj) { return "createAppointment" in obj; }, get: function (obj) { return obj.createAppointment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getByUser_decorators, { kind: "method", name: "getByUser", static: false, private: false, access: { has: function (obj) { return "getByUser" in obj; }, get: function (obj) { return obj.getByUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppointmentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppointmentsController = _classThis;
}();
exports.AppointmentsController = AppointmentsController;
