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
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var bcrypt = require("bcryptjs");
var UsersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UsersService = _classThis = /** @class */ (function () {
        function UsersService_1(usersRepo, prisma) {
            this.usersRepo = usersRepo;
            this.prisma = prisma;
        }
        UsersService_1.prototype.findOneByUsername = function (username) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.usersRepo.findByUsername(username)];
                        case 1:
                            user = _a.sent();
                            if (!user)
                                throw new common_1.NotFoundException('Usuario no encontrado');
                            return [2 /*return*/, user];
                    }
                });
            });
        };
        UsersService_1.prototype.hashPassword = function (password) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bcrypt.hash(password, 10)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        UsersService_1.prototype.comparePassword = function (password, hash) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, bcrypt.compare(password, hash)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * ACTUALIZAR FOTO CON CLOUDINARY
         * Este método reemplaza la lógica local por la de la nube.
         */
        UsersService_1.prototype.updatePhoto = function (id_usuario, public_id) {
            return __awaiter(this, void 0, void 0, function () {
                var usuario;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.usuarios.findUnique({
                                where: { id_usuario: id_usuario },
                            })];
                        case 1:
                            usuario = _a.sent();
                            if (!usuario) {
                                throw new common_1.NotFoundException("El usuario con ID ".concat(id_usuario, " no fue encontrado."));
                            }
                            return [4 /*yield*/, this.prisma.usuarios.update({
                                    where: { id_usuario: id_usuario },
                                    data: {
                                        foto_perfil: public_id,
                                    },
                                })];
                        case 2: 
                        // 2. Actualizamos la columna foto_perfil con el ID de Cloudinary
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // MÉTODOS DE PRISMA EXISTENTES
        UsersService_1.prototype.obtenerTodos = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.usuarios.findMany()];
                });
            });
        };
        // --- NUEVOS MÉTODOS PARA EL DASHBOARD DE ADMIN ---
        UsersService_1.prototype.activateClient = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.usuarios.update({
                                    where: { id_usuario: id },
                                    data: { estado: true },
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, { success: true }];
                        case 2:
                            error_1 = _a.sent();
                            console.error(error_1);
                            return [2 /*return*/, { success: false }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        UsersService_1.prototype.deactivateClient = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.remove(id)];
                        case 1:
                            _a.sent(); // remove() ya pone el estado en false
                            return [2 /*return*/, { success: true }];
                        case 2:
                            error_2 = _a.sent();
                            console.error(error_2);
                            return [2 /*return*/, { success: false }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        UsersService_1.prototype.findAllClients = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.usuarios.findMany({
                                    where: { id_rol: 2 }, // Clientes (todos, activos e inactivos)
                                    orderBy: { created_at: 'desc' },
                                })];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { success: true, data: data }];
                        case 2:
                            error_3 = _a.sent();
                            return [2 /*return*/, { success: false, data: [] }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        UsersService_1.prototype.findAllAdmins = function () {
            return __awaiter(this, void 0, void 0, function () {
                var data, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.usuarios.findMany({
                                    where: { id_rol: 1 }, // Administradores
                                    orderBy: { created_at: 'desc' },
                                })];
                        case 1:
                            data = _a.sent();
                            return [2 /*return*/, { success: true, data: data }];
                        case 2:
                            error_4 = _a.sent();
                            return [2 /*return*/, { success: false, data: [] }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        UsersService_1.prototype.crearUsuario = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var hashedPassword;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.hashPassword(data.password_hash)];
                        case 1:
                            hashedPassword = _a.sent();
                            return [4 /*yield*/, this.prisma.usuarios.create({
                                    data: {
                                        username: data.username,
                                        prim_nombre: data.prim_nombre,
                                        seg_nombre: data.seg_nombre,
                                        apellido1: data.apellido1,
                                        apellido2: data.apellido2,
                                        email: data.email,
                                        password_hash: hashedPassword,
                                        telefono: data.telefono,
                                        estado: data.estado !== undefined ? data.estado : true,
                                        id_rol: data.id_rol !== undefined ? data.id_rol : 2,
                                        foto_perfil: data.foto_perfil,
                                    },
                                })];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // --- NUEVOS MÉTODOS PARA EL CRUD DEL ADMIN ---
        UsersService_1.prototype.findOne = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var usuario;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.usuarios.findUnique({
                                where: { id_usuario: id },
                                include: { rol: true }, // Opcional: Para devolver el nombre del rol también
                            })];
                        case 1:
                            usuario = _a.sent();
                            if (!usuario)
                                throw new common_1.NotFoundException("Usuario con ID ".concat(id, " no encontrado"));
                            return [2 /*return*/, usuario];
                    }
                });
            });
        };
        UsersService_1.prototype.update = function (id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            _b.sent(); // Verifica si existe primero
                            if (!data.password_hash) return [3 /*break*/, 3];
                            _a = data;
                            return [4 /*yield*/, this.hashPassword(data.password_hash)];
                        case 2:
                            _a.password_hash = _b.sent();
                            _b.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.usuarios.update({
                                where: { id_usuario: id },
                                data: data,
                            })];
                        case 4: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        };
        UsersService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findOne(id)];
                        case 1:
                            _a.sent(); // Verifica si existe
                            return [4 /*yield*/, this.prisma.usuarios.update({
                                    where: { id_usuario: id },
                                    data: { estado: false },
                                })];
                        case 2: // Verifica si existe
                        // Borrado suave (soft-delete): Cambiamos su estado a false (inactivo)
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return UsersService_1;
    }());
    __setFunctionName(_classThis, "UsersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersService = _classThis;
}();
exports.UsersService = UsersService;
