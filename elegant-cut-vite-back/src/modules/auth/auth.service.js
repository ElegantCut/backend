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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var bcrypt = require("bcryptjs");
var google_auth_library_1 = require("google-auth-library");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(usersService, jwtService, emailService, prisma) {
            this.usersService = usersService;
            this.jwtService = jwtService;
            this.emailService = emailService;
            this.prisma = prisma;
            this.googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        }
        AuthService_1.prototype.login = function (loginDto) {
            return __awaiter(this, void 0, void 0, function () {
                var username, contrasena, user, isMatch, role, payload;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            username = loginDto.username, contrasena = loginDto.contrasena;
                            return [4 /*yield*/, this.usersService.findOneByUsername(username)];
                        case 1:
                            user = _c.sent();
                            // Validar si el usuario está activo
                            if (!user.estado) {
                                throw new common_1.UnauthorizedException('Tu cuenta está desactivada. Por favor, contacta al administrador.');
                            }
                            return [4 /*yield*/, this.usersService.comparePassword(contrasena, (_a = user.password_hash) !== null && _a !== void 0 ? _a : '')];
                        case 2:
                            isMatch = _c.sent();
                            if (!isMatch)
                                throw new common_1.UnauthorizedException('Contraseña incorrecta');
                            role = ((_b = user.rol) === null || _b === void 0 ? void 0 : _b.nombre_rol)
                                ? user.rol.nombre_rol.toLowerCase()
                                : 'cliente';
                            if (role === 'administrador')
                                role = 'admin';
                            if (role === 'barbero')
                                role = 'barber';
                            payload = {
                                id: user.id_usuario,
                                id_usuario: user.id_usuario,
                                username: user.username,
                                email: user.email,
                                name: "".concat(user.prim_nombre, " ").concat(user.apellido1),
                                role: role,
                                id_rol: user.id_rol,
                                userId: user.id_usuario,
                            };
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Login exitoso',
                                    token: this.jwtService.sign(payload),
                                    user: {
                                        id_usuario: user.id_usuario,
                                        username: user.username,
                                        email: user.email,
                                        name: "".concat(user.prim_nombre, " ").concat(user.apellido1),
                                        role: role,
                                        id_rol: user.id_rol,
                                        userId: user.id_usuario,
                                    },
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.register = function (registerDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.usersService.crearUsuario(__assign(__assign({}, registerDto), { id_rol: registerDto.id_rol || 2 }))];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AuthService_1.prototype.traerUsuarios = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.usersService.obtenerTodos()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        /**
         * Proceso para actualizar la contraseña utilizando el código de verificación
         * enviado previamente al correo del usuario.
         */
        AuthService_1.prototype.resetPassword = function (resetPasswordDto) {
            return __awaiter(this, void 0, void 0, function () {
                var email, codigo, newPassword, verificacion, salt, hashedPassword;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            email = resetPasswordDto.email, codigo = resetPasswordDto.codigo, newPassword = resetPasswordDto.newPassword;
                            return [4 /*yield*/, this.prisma.codigos_verificacion.findFirst({
                                    where: {
                                        email: email,
                                        codigo: codigo,
                                        tipo: client_1.codigos_verificacion_tipo.recuperacion,
                                        usado: false,
                                        expira_en: { gte: new Date() }, // Verifica que no haya expirado
                                    },
                                })];
                        case 1:
                            verificacion = _a.sent();
                            if (!verificacion) {
                                throw new common_1.BadRequestException('El código es inválido o ha expirado');
                            }
                            return [4 /*yield*/, bcrypt.genSalt(10)];
                        case 2:
                            salt = _a.sent();
                            return [4 /*yield*/, bcrypt.hash(newPassword, salt)];
                        case 3:
                            hashedPassword = _a.sent();
                            return [4 /*yield*/, this.prisma.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var usuarios;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, tx.usuarios.findMany({ where: { email: email } })];
                                            case 1:
                                                usuarios = _a.sent();
                                                if (usuarios.length === 0)
                                                    throw new common_1.BadRequestException('No existe un usuario con ese correo');
                                                return [4 /*yield*/, tx.usuarios.updateMany({
                                                        where: { email: email },
                                                        data: { password_hash: hashedPassword },
                                                    })];
                                            case 2:
                                                _a.sent();
                                                return [4 /*yield*/, tx.codigos_verificacion.update({
                                                        where: { id: verificacion.id },
                                                        data: { usado: true },
                                                    })];
                                            case 3:
                                                _a.sent();
                                                return [2 /*return*/, {
                                                        success: true,
                                                        message: 'Contraseña actualizada correctamente',
                                                    }];
                                        }
                                    });
                                }); })];
                        case 4: 
                        // 3. Transacción: Actualizar usuarios y marcar código como usado
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AuthService_1.prototype.solicitarRecuperacion = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                var usuario, codigoSecreto, fechaExpiracion;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.usuarios.findFirst({ where: { email: email } })];
                        case 1:
                            usuario = _a.sent();
                            if (!usuario) {
                                return [2 /*return*/, {
                                        message: 'Si el correo existe en nuestro sistema, recibirás un código.',
                                    }];
                            }
                            codigoSecreto = Math.floor(100000 + Math.random() * 900000).toString();
                            fechaExpiracion = new Date();
                            fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);
                            // 4. Guardar en la tabla codigos_verificacion
                            return [4 /*yield*/, this.prisma.codigos_verificacion.create({
                                    data: {
                                        email: email,
                                        codigo: codigoSecreto,
                                        tipo: client_1.codigos_verificacion_tipo.recuperacion,
                                        expira_en: fechaExpiracion,
                                        usado: false,
                                    },
                                })];
                        case 2:
                            // 4. Guardar en la tabla codigos_verificacion
                            _a.sent();
                            return [4 /*yield*/, this.emailService.sendVerificationCode(email, codigoSecreto)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, { message: 'Se ha enviado un código a tu correo.' }];
                    }
                });
            });
        };
        AuthService_1.prototype.googleLogin = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var ticket, payload, email, google_id, given_name, family_name, picture, user, role, jwtPayload, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 7, , 8]);
                            return [4 /*yield*/, this.googleClient.verifyIdToken({
                                    idToken: token,
                                    audience: process.env.GOOGLE_CLIENT_ID,
                                })];
                        case 1:
                            ticket = _b.sent();
                            payload = ticket.getPayload();
                            if (!payload)
                                throw new common_1.BadRequestException('Token de Google inválido');
                            email = payload.email, google_id = payload.sub, given_name = payload.given_name, family_name = payload.family_name, picture = payload.picture;
                            return [4 /*yield*/, this.prisma.usuarios.findFirst({
                                    where: {
                                        OR: [{ email: email }, { google_id: google_id }],
                                    },
                                    include: { rol: true },
                                })];
                        case 2:
                            user = _b.sent();
                            if (!!user) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.usuarios.create({
                                    data: {
                                        email: email,
                                        google_id: google_id,
                                        prim_nombre: given_name || 'Usuario',
                                        apellido1: family_name || 'Google',
                                        id_rol: 2, // Rol cliente
                                        estado: true,
                                        foto_perfil: picture,
                                        username: (email || 'user').split('@')[0] +
                                            Math.floor(Math.random() * 1000),
                                    },
                                    include: { rol: true },
                                })];
                        case 3:
                            // POBALR TABLA: Si no existe, lo creamos
                            user = _b.sent();
                            return [3 /*break*/, 6];
                        case 4:
                            if (!!user.google_id) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.prisma.usuarios.update({
                                    where: { id_usuario: user.id_usuario },
                                    data: { google_id: google_id },
                                    include: { rol: true },
                                })];
                        case 5:
                            // Si existía por email pero no tenía google_id, lo vinculamos
                            user = _b.sent();
                            _b.label = 6;
                        case 6:
                            role = ((_a = user.rol) === null || _a === void 0 ? void 0 : _a.nombre_rol)
                                ? user.rol.nombre_rol.toLowerCase()
                                : 'cliente';
                            if (role === 'administrador')
                                role = 'admin';
                            if (role === 'barbero')
                                role = 'barber';
                            jwtPayload = {
                                id: user.id_usuario,
                                id_usuario: user.id_usuario,
                                username: user.username,
                                email: user.email,
                                name: "".concat(user.prim_nombre, " ").concat(user.apellido1),
                                role: role,
                                id_rol: user.id_rol,
                                userId: user.id_usuario,
                            };
                            return [2 /*return*/, {
                                    success: true,
                                    message: 'Login con Google exitoso',
                                    token: this.jwtService.sign(jwtPayload),
                                    user: {
                                        id_usuario: user.id_usuario,
                                        username: user.username,
                                        email: user.email,
                                        name: "".concat(user.prim_nombre, " ").concat(user.apellido1),
                                        role: role,
                                        id_rol: user.id_rol,
                                        userId: user.id_usuario,
                                    },
                                }];
                        case 7:
                            error_1 = _b.sent();
                            console.error('Error en Google Login:', error_1);
                            throw new common_1.UnauthorizedException('Error al validar con Google');
                        case 8: return [2 /*return*/];
                    }
                });
            });
        };
        AuthService_1.prototype.validateToken = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            statusCode: 200,
                            message: 'Token validado exitosamente',
                            user: {
                                id_usuario: user.id_usuario,
                                username: user.username,
                                email: user.email,
                                id_rol: user.id_rol,
                                role: user.role,
                                name: user.name,
                                userId: user.id_usuario,
                            },
                        }];
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
