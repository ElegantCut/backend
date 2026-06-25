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
exports.AppointmentsService = void 0;
var common_1 = require("@nestjs/common");
var AppointmentsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppointmentsService = _classThis = /** @class */ (function () {
        function AppointmentsService_1(appointmentsRepo, usersRepo) {
            this.appointmentsRepo = appointmentsRepo;
            this.usersRepo = usersRepo;
        }
        AppointmentsService_1.prototype.getAvailability = function (date, barberId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appointmentsRepo.getAvailableSlots(date, barberId)];
                });
            });
        };
        AppointmentsService_1.prototype.bookAppointment = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appointmentsRepo.create(data)];
                });
            });
        };
        AppointmentsService_1.prototype.getAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.appointmentsRepo.findAll()];
                });
            });
        };
        // Nuevo método formateado específicamente para el listado del panel de Administrador
        AppointmentsService_1.prototype.findAllAdmin = function () {
            return __awaiter(this, void 0, void 0, function () {
                var citas, data, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.appointmentsRepo.findAllWithDetails()];
                        case 1:
                            citas = _a.sent();
                            data = citas.map(function (cita) {
                                var _a, _b, _c, _d;
                                // Determinar estado textual sugerido (1=Pendiente, 2=Completada, 3=Cancelada)
                                var estadoText = 'Pendiente';
                                if (cita.id_estado_cita === 2)
                                    estadoText = 'Completada';
                                if (cita.id_estado_cita === 3)
                                    estadoText = 'Cancelada';
                                // Extraer el nombre del servicio principal
                                var srv = (_b = (_a = cita.detalle_cita_servicio) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.servicios;
                                var nombreServicio = srv ? srv.nombre : 'Servicio general';
                                // Formatear hora inicio (ej. 900 -> "9:00 AM")
                                var horaStr = ((_d = (_c = cita.horarios) === null || _c === void 0 ? void 0 : _c.hora_inicio) === null || _d === void 0 ? void 0 : _d.toString()) || '000';
                                if (horaStr.length === 3)
                                    horaStr = '0' + horaStr; // 900 -> 0900
                                var hh = horaStr.slice(0, 2);
                                var mm = horaStr.slice(2, 4);
                                var horaFormat = "".concat(hh, ":").concat(mm);
                                return {
                                    id_reservas: cita.id_reservas,
                                    fecha: cita.fecha,
                                    hora_inicio: horaFormat,
                                    cliente: cita.usuarios ? "".concat(cita.usuarios.prim_nombre, " ").concat(cita.usuarios.apellido1) : 'Desconocido',
                                    servicio: nombreServicio,
                                    estado: estadoText
                                };
                            });
                            return [2 /*return*/, { success: true, data: data }];
                        case 2:
                            error_1 = _a.sent();
                            console.error("Error fetching admin appointments:", error_1);
                            return [2 /*return*/, { success: false, data: [] }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // Nuevo método formateado específicamente para el listado del panel de Administrador
        AppointmentsService_1.prototype.changeStatusAdmin = function (id, nuevoEstado) {
            return __awaiter(this, void 0, void 0, function () {
                var updated, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            console.log("[Admin] Actualizando cita ".concat(id, " a estado ").concat(nuevoEstado));
                            return [4 /*yield*/, this.appointmentsRepo.updateAppointmentStatus(id, nuevoEstado)];
                        case 1:
                            updated = _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    message: "Cita ".concat(id, " actualizada con \u00E9xito"),
                                    data: updated
                                }];
                        case 2:
                            error_2 = _a.sent();
                            console.error("[Admin Error] Fall\u00F3 actualizaci\u00F3n de cita ".concat(id, ":"), error_2.message);
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'No se pudo actualizar la cita. Verifique que el ID sea correcto.'
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AppointmentsService_1.prototype.getAppointmentsByBarber = function (barberId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.appointmentsRepo.findAppointmentsByBarber(barberId)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AppointmentsService_1.prototype.createAppointment = function (datos) {
            return __awaiter(this, void 0, void 0, function () {
                var id_servicio, reservaData, reserva, n8nWebhookUrl, reservaAny, datosAny, cliente, emailFinal, nombreFinal, payload, error_3;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            id_servicio = Number(datos.id_servicio);
                            reservaData = {
                                fecha: new Date(datos.fecha),
                                observaciones: datos.observaciones,
                                id_usuario: Number(datos.id_usuario),
                                id_empleado: Number(datos.id_empleado),
                                id_estado_cita: Number(datos.id_estado_cita),
                                id_horarios: Number(datos.id_horarios),
                            };
                            return [4 /*yield*/, this.appointmentsRepo.createAppointmentWithTransaction(reservaData, id_servicio)];
                        case 1:
                            reserva = _c.sent();
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            n8nWebhookUrl = 'http://elegant_n8n:5678/webhook/nueva-cita';
                            reservaAny = reserva;
                            datosAny = datos;
                            return [4 /*yield*/, this.appointmentsRepo.findUserByUserId(Number(datosAny.id_usuario))];
                        case 3:
                            cliente = _c.sent();
                            emailFinal = datosAny.email_contacto || (cliente === null || cliente === void 0 ? void 0 : cliente.email) || '';
                            nombreFinal = datosAny.nombre_contacto || "".concat((_a = cliente === null || cliente === void 0 ? void 0 : cliente.prim_nombre) !== null && _a !== void 0 ? _a : '', " ").concat((_b = cliente === null || cliente === void 0 ? void 0 : cliente.apellido1) !== null && _b !== void 0 ? _b : '').trim() || 'Cliente';
                            payload = {
                                evento: 'NUEVA_CITA',
                                id_reserva: reservaAny.id_reservas,
                                cliente_id: datosAny.id_usuario,
                                email_cliente: emailFinal,
                                nombre_cliente: nombreFinal,
                                fecha: datosAny.fecha,
                                observaciones: datosAny.observaciones
                            };
                            console.log('PAYLOAD PARA N8N:', payload);
                            fetch(n8nWebhookUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            }).catch(function (err) { return console.error('Error enviando a n8n:', err); });
                            console.log('🚀 Evento de cita enviado a n8n');
                            return [3 /*break*/, 5];
                        case 4:
                            error_3 = _c.sent();
                            console.warn('No se pudo enviar a n8n:', error_3);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/, reserva];
                    }
                });
            });
        };
        AppointmentsService_1.prototype.getHorarios = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.appointmentsRepo.findAllHorarios()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // --- NUEVOS MÉTODOS PARA EL CRUD DEL ADMIN ---
        AppointmentsService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var cita;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.appointmentsRepo.findUniqueWithDetails(id)];
                        case 1:
                            cita = _a.sent();
                            if (!cita)
                                throw new common_1.NotFoundException("Cita con ID ".concat(id, " no encontrada"));
                            return [2 /*return*/, cita];
                    }
                });
            });
        };
        AppointmentsService_1.prototype.getAppointmentsByUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var numericUserId, citas, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            numericUserId = Number(userId);
                            return [4 /*yield*/, this.appointmentsRepo.findAppointmentsByUser(numericUserId)];
                        case 1:
                            citas = _a.sent();
                            return [2 /*return*/, { success: true, data: citas }];
                        case 2:
                            error_4 = _a.sent();
                            console.error("Error fetching user appointments:", error_4);
                            return [2 /*return*/, { success: false, data: [] }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AppointmentsService_1.prototype.update = function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            _a.sent(); // Verifica si existe
                            // Si mandan una fecha en string, la parseamos a Date
                            if (data.fecha) {
                                data.fecha = new Date(data.fecha);
                            }
                            return [4 /*yield*/, this.appointmentsRepo.updateAppointment(id, data)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // --- MÉTODO PARA RECORDATORIOS (n8n) ---
        AppointmentsService_1.prototype.getTomorrowReminders = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tomorrow, dayAfterTomorrow, citas;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            tomorrow.setHours(0, 0, 0, 0);
                            dayAfterTomorrow = new Date(tomorrow);
                            dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
                            return [4 /*yield*/, this.appointmentsRepo.findTomorrowReminders(tomorrow, dayAfterTomorrow)];
                        case 1:
                            citas = _a.sent();
                            return [2 /*return*/, citas.map(function (cita) {
                                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                                    // Formatear hora inicio (900 -> "9:00")
                                    var horaStr = ((_b = (_a = cita.horarios) === null || _a === void 0 ? void 0 : _a.hora_inicio) === null || _b === void 0 ? void 0 : _b.toString()) || '0000';
                                    if (horaStr.length === 3)
                                        horaStr = '0' + horaStr;
                                    var hh = horaStr.slice(0, 2);
                                    var mm = horaStr.slice(2, 4);
                                    return {
                                        id_reserva: cita.id_reservas,
                                        cliente_nombre: "".concat((_d = (_c = cita.usuarios) === null || _c === void 0 ? void 0 : _c.prim_nombre) !== null && _d !== void 0 ? _d : '', " ").concat((_f = (_e = cita.usuarios) === null || _e === void 0 ? void 0 : _e.apellido1) !== null && _f !== void 0 ? _f : '').trim() || 'Cliente',
                                        cliente_email: ((_g = cita.usuarios) === null || _g === void 0 ? void 0 : _g.email) || '',
                                        fecha: cita.fecha.toISOString().split('T')[0],
                                        hora: "".concat(hh, ":").concat(mm),
                                        servicio: ((_k = (_j = (_h = cita.detalle_cita_servicio) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.servicios) === null || _k === void 0 ? void 0 : _k.nombre) || 'Servicio Barbería'
                                    };
                                })];
                    }
                });
            });
        };
        return AppointmentsService_1;
    }());
    __setFunctionName(_classThis, "AppointmentsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppointmentsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppointmentsService = _classThis;
}();
exports.AppointmentsService = AppointmentsService;
