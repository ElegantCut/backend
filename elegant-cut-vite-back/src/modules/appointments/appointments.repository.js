"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.AppointmentsRepository = void 0;
var common_1 = require("@nestjs/common");
var AppointmentsRepository = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppointmentsRepository = _classThis = /** @class */ (function () {
        function AppointmentsRepository_1(prisma) {
            this.prisma = prisma;
        }
        AppointmentsRepository_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.reservas.findMany({
                            orderBy: { fecha: 'desc' },
                            select: {
                                id_reservas: true,
                                fecha: true,
                                observaciones: true,
                                id_estado_cita: true,
                                usuarios: {
                                    select: { prim_nombre: true, apellido1: true },
                                },
                                horarios: {
                                    select: { hora_inicio: true },
                                },
                            },
                        })];
                });
            });
        };
        AppointmentsRepository_1.prototype.getAvailableSlots = function (date, barberId) {
            return __awaiter(this, void 0, void 0, function () {
                var targetDate, nextDay, _a, allSlots, occupied, occupiedTimes;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            targetDate = new Date(date);
                            nextDay = new Date(targetDate);
                            nextDay.setDate(nextDay.getDate() + 1);
                            return [4 /*yield*/, Promise.all([
                                    this.prisma.horarios.findMany({
                                        orderBy: { hora_inicio: 'asc' },
                                    }),
                                    this.prisma.reservas.findMany({
                                        where: {
                                            fecha: { gte: targetDate, lt: nextDay },
                                            id_estado_cita: { in: [1, 2] },
                                        },
                                        select: { horarios: { select: { hora_inicio: true } } },
                                    }),
                                ])];
                        case 1:
                            _a = _b.sent(), allSlots = _a[0], occupied = _a[1];
                            occupiedTimes = new Set(occupied.map(function (r) { var _a; return (_a = r.horarios) === null || _a === void 0 ? void 0 : _a.hora_inicio; }));
                            return [2 /*return*/, allSlots.map(function (slot) { return ({
                                    id: slot.id_horarios,
                                    time: slot.hora_inicio.toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2'),
                                    isAvailable: !occupiedTimes.has(slot.hora_inicio),
                                }); })];
                    }
                });
            });
        };
        AppointmentsRepository_1.prototype.create = function (appointmentData) {
            return __awaiter(this, void 0, void 0, function () {
                var userId, date, notes, idHorarios, serviceId;
                var _this = this;
                return __generator(this, function (_a) {
                    userId = appointmentData.userId, date = appointmentData.date, notes = appointmentData.notes, idHorarios = appointmentData.idHorarios, serviceId = appointmentData.serviceId;
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var reserva;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.reservas.create({
                                            data: {
                                                fecha: new Date(date),
                                                observaciones: notes || '',
                                                id_usuario: userId,
                                                id_estado_cita: 1,
                                                id_horarios: idHorarios,
                                            },
                                        })];
                                    case 1:
                                        reserva = _a.sent();
                                        return [4 /*yield*/, tx.detalle_cita_servicio.create({
                                                data: {
                                                    id_reservas: reserva.id_reservas,
                                                    id_servicio: serviceId,
                                                },
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, reserva.id_reservas];
                                }
                            });
                        }); })];
                });
            });
        };
        // --- NUEVOS MÉTODOS DE REPOSITORIO PARA CUMPLIR CON SOLID ---
        AppointmentsRepository_1.prototype.findAllWithDetails = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.reservas.findMany({
                            include: {
                                usuarios: true,
                                horarios: true,
                                detalle_cita_servicio: {
                                    include: { servicios: true }
                                }
                            },
                            orderBy: { fecha: 'desc' }
                        })];
                });
            });
        };
        AppointmentsRepository_1.prototype.updateAppointmentStatus = function (id, nuevoEstado) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.reservas.update({
                            where: { id_reservas: id },
                            data: { id_estado_cita: nuevoEstado }
                        })];
                });
            });
        };
        AppointmentsRepository_1.prototype.findAppointmentsByBarber = function (barberId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.reservas.findMany({
                            where: {
                                id_empleado: barberId,
                            },
                            include: {
                                usuarios: true,
                                horarios: true,
                                detalle_cita_servicio: {
                                    include: {
                                        servicios: true
                                    }
                                }
                            }
                        })];
                });
            });
        };
        AppointmentsRepository_1.prototype.createAppointmentWithTransaction = function (reservaData, id_servicio) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var reservaResult;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.reservas.create({
                                            data: reservaData,
                                        })];
                                    case 1:
                                        reservaResult = _a.sent();
                                        return [4 /*yield*/, tx.detalle_cita_servicio.create({
                                                data: {
                                                    id_reservas: reservaResult.id_reservas,
                                                    id_servicio: id_servicio
                                                }
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, reservaResult];
                                }
                            });
                        }); })];
                });
            });
        };
        AppointmentsRepository_1.prototype.findUserByUserId = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.usuarios.findUnique({
                            where: { id_usuario: userId },
                            select: { email: true, prim_nombre: true, apellido1: true }
                        })];
                });
            });
        };
        AppointmentsRepository_1.prototype.findAllHorarios = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.horarios.findMany({
                            orderBy: { hora_inicio: 'asc' }
                        })];
                });
            });
        };
        AppointmentsRepository_1.prototype.findUniqueWithDetails = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.reservas.findUnique({
                            where: { id_reservas: id },
                            include: {
                                usuarios: {
                                    select: { prim_nombre: true, apellido1: true, telefono: true, email: true }
                                },
                                estado_cita: true,
                                horarios: true,
                                detalle_cita_servicio: {
                                    include: { servicios: true }
                                }
                            }
                        })];
                });
            });
        };
        AppointmentsRepository_1.prototype.findAppointmentsByUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.reservas.findMany({
                            where: { id_usuario: userId },
                            include: {
                                horarios: true,
                                estado_cita: true,
                                detalle_cita_servicio: {
                                    include: { servicios: true }
                                }
                            },
                            orderBy: { fecha: 'desc' }
                        })];
                });
            });
        };
        AppointmentsRepository_1.prototype.updateAppointment = function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.reservas.update({
                            where: { id_reservas: id },
                            data: data,
                            include: { estado_cita: true }
                        })];
                });
            });
        };
        AppointmentsRepository_1.prototype.findTomorrowReminders = function (tomorrow, dayAfterTomorrow) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.reservas.findMany({
                            where: {
                                fecha: {
                                    gte: tomorrow,
                                    lt: dayAfterTomorrow
                                },
                                id_estado_cita: 1 // Solo pendientes
                            },
                            include: {
                                usuarios: true,
                                horarios: true,
                                detalle_cita_servicio: {
                                    include: { servicios: true }
                                }
                            }
                        })];
                });
            });
        };
        return AppointmentsRepository_1;
    }());
    __setFunctionName(_classThis, "AppointmentsRepository");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppointmentsRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppointmentsRepository = _classThis;
}();
exports.AppointmentsRepository = AppointmentsRepository;
