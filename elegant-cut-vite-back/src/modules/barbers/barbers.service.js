"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarbersService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcryptjs");
var BarbersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var BarbersService = _classThis = /** @class */ (function () {
        function BarbersService_1(barbersRepo) {
            this.barbersRepo = barbersRepo;
        }
        BarbersService_1.prototype.getAllBarbers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data, mappedData, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.barbersRepo.findAllWithPortfolioAndReviews(true)];
                        case 1:
                            data = _a.sent();
                            mappedData = data.map(function (barber) { return _this.mapBarberWithRating(barber); });
                            return [2 /*return*/, { success: true, data: mappedData }];
                        case 2:
                            error_1 = _a.sent();
                            return [2 /*return*/, { success: false, data: [] }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        BarbersService_1.prototype.getPublicBarbers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var barbers;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.barbersRepo.findActive()];
                        case 1:
                            barbers = _a.sent();
                            return [2 /*return*/, barbers.map(function (barber) { return _this.mapBarberWithRating(barber); })];
                    }
                });
            });
        };
        BarbersService_1.prototype.getBarberStats = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.barbersRepo.getStats(id)];
                });
            });
        };
        BarbersService_1.prototype.obtenerBarberos = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.barbersRepo.findAllWithPortfolioAndReviews(false)];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, data.map(function (barber) { return _this.mapBarberWithRating(barber); })];
                    }
                });
            });
        };
        BarbersService_1.prototype.crearBarbero = function (createBarberDto) {
            return __awaiter(this, void 0, void 0, function () {
                var salt, hashedPassword, userData, portfolioData, nuevoBarbero, password_hash, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bcrypt.genSalt(10)];
                        case 1:
                            salt = _a.sent();
                            return [4 /*yield*/, bcrypt.hash(createBarberDto.password_hash, salt)];
                        case 2:
                            hashedPassword = _a.sent();
                            userData = {
                                prim_nombre: createBarberDto.prim_nombre,
                                seg_nombre: createBarberDto.seg_nombre,
                                apellido1: createBarberDto.apellido1,
                                apellido2: createBarberDto.apellido2,
                                email: createBarberDto.email,
                                username: createBarberDto.username,
                                telefono: createBarberDto.telefono,
                                password_hash: hashedPassword,
                            };
                            portfolioData = {
                                biografia: createBarberDto.biografia || null,
                                experiencia: createBarberDto.experiencia || null,
                                especialidades: createBarberDto.especialidades || null,
                            };
                            return [4 /*yield*/, this.barbersRepo.createBarberWithPortfolio(userData, portfolioData)];
                        case 3:
                            nuevoBarbero = _a.sent();
                            password_hash = nuevoBarbero.password_hash, result = __rest(nuevoBarbero, ["password_hash"]);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        BarbersService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var barbero, mappedBarber, password_hash, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.barbersRepo.findOneWithDetails(id)];
                        case 1:
                            barbero = _a.sent();
                            if (!barbero)
                                throw new common_1.NotFoundException("Barbero con ID ".concat(id, " no encontrado"));
                            mappedBarber = this.mapBarberWithRating(barbero);
                            password_hash = mappedBarber.password_hash, result = __rest(mappedBarber, ["password_hash"]);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        BarbersService_1.prototype.update = function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var salt, _a, portafolioData, actualizado, portafolioExistente, password_hash, result;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            _b.sent(); // Verifica si existe
                            if (!data.password_hash) return [3 /*break*/, 4];
                            return [4 /*yield*/, bcrypt.genSalt(10)];
                        case 2:
                            salt = _b.sent();
                            _a = data;
                            return [4 /*yield*/, bcrypt.hash(data.password_hash, salt)];
                        case 3:
                            _a.password_hash = _b.sent();
                            _b.label = 4;
                        case 4:
                            portafolioData = {};
                            if ('biografia' in data) {
                                portafolioData.biografia = data.biografia;
                                delete data.biografia;
                            }
                            if ('experiencia' in data) {
                                portafolioData.experiencia = data.experiencia;
                                delete data.experiencia;
                            }
                            if ('especialidades' in data) {
                                portafolioData.especialidades = data.especialidades;
                                delete data.especialidades;
                            }
                            return [4 /*yield*/, this.barbersRepo.updateBarber(id, data)];
                        case 5:
                            actualizado = _b.sent();
                            if (!(Object.keys(portafolioData).length > 0)) return [3 /*break*/, 10];
                            return [4 /*yield*/, this.barbersRepo.findPortfolioByUserId(id)];
                        case 6:
                            portafolioExistente = _b.sent();
                            if (!portafolioExistente) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.barbersRepo.updatePortfolio(portafolioExistente.id_portafolio, portafolioData)];
                        case 7:
                            _b.sent();
                            return [3 /*break*/, 10];
                        case 8: return [4 /*yield*/, this.barbersRepo.createPortfolio(__assign(__assign({}, portafolioData), { id_usuario: id }))];
                        case 9:
                            _b.sent();
                            _b.label = 10;
                        case 10:
                            password_hash = actualizado.password_hash, result = __rest(actualizado, ["password_hash"]);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        BarbersService_1.prototype.toggleStatus = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var barbero, newStatus;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            barbero = _a.sent();
                            newStatus = !barbero.estado;
                            return [4 /*yield*/, this.barbersRepo.updateBarber(id, { estado: newStatus })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { success: true, newStatus: newStatus }];
                    }
                });
            });
        };
        BarbersService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            _a.sent(); // Verifica si existe
                            return [4 /*yield*/, this.barbersRepo.updateBarber(id, { estado: false })];
                        case 2: // Verifica si existe
                        // Soft delete
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        BarbersService_1.prototype.mapBarberWithRating = function (barber) {
            var resenas = barber.resenas_recibidas || [];
            var count = resenas.length;
            var sum = resenas.reduce(function (acc, r) { return acc + r.calificacion; }, 0);
            var avg = count > 0 ? (sum / count).toFixed(1) : "5.0";
            barber.calificacion_promedio = parseFloat(avg);
            barber.total_resenas = count;
            var portfolio = Array.isArray(barber.portafolios) ? barber.portafolios[0] : barber.portafolios;
            if (portfolio) {
                portfolio.calificacion = parseFloat(avg);
                portfolio.rese_as_count = count;
            }
            return barber;
        };
        return BarbersService_1;
    }());
    __setFunctionName(_classThis, "BarbersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BarbersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BarbersService = _classThis;
}();
exports.BarbersService = BarbersService;
