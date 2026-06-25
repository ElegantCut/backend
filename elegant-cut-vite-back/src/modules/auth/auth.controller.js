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
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var passport_1 = require("@nestjs/passport");
var jwt_auth_guard_1 = require("./guards/jwt-auth.guard"); // importa el guard que creamos
var AuthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Auth - Autenticación'), (0, common_1.Controller)('auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _checkToken_decorators;
    var _login_decorators;
    var _register_decorators;
    var _googleLogin_decorators;
    var _getProfile_decorators;
    var _resetPassword_decorators;
    var _forgotPassword_decorators;
    var _logout_decorators;
    var AuthController = _classThis = /** @class */ (function () {
        function AuthController_1(authService) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
        }
        //protegemos la ruta de login con el guard
        AuthController_1.prototype.checkToken = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.validateToken(req.user)];
                });
            });
        };
        AuthController_1.prototype.login = function (loginDto, res) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.login(loginDto)];
                        case 1:
                            result = _a.sent();
                            res.cookie('jwt', result.token, {
                                httpOnly: true,
                                secure: false, // Debe ser false para http://localhost
                                sameSite: 'lax',
                                path: '/',
                                maxAge: 24 * 60 * 60 * 1000,
                            });
                            // Retornamos el resultado completo incluyendo el token
                            // El frontend usa la cookie automáticamente, y Swagger puede ver el token en la respuesta
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        AuthController_1.prototype.register = function (registerDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.register(registerDto)];
                });
            });
        };
        AuthController_1.prototype.googleLogin = function (token, res) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.googleLogin(token)];
                        case 1:
                            result = _a.sent();
                            res.cookie('jwt', result.token, {
                                httpOnly: true,
                                secure: false,
                                sameSite: 'lax',
                                path: '/',
                                maxAge: 24 * 60 * 60 * 1000,
                            });
                            // Retornamos el resultado completo incluyendo el token al igual que el login normal
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        AuthController_1.prototype.getProfile = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, { success: true, data: req.user }];
                });
            });
        };
        //creamos el nuevo método put
        AuthController_1.prototype.resetPassword = function (resetPasswordDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.resetPassword(resetPasswordDto)];
                });
            });
        };
        //  codigo de recuperacion de correo se hace con el método post
        AuthController_1.prototype.forgotPassword = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.solicitarRecuperacion(email)];
                });
            });
        };
        AuthController_1.prototype.logout = function (res) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    res.clearCookie('jwt');
                    return [2 /*return*/, { success: true, message: 'Sesión cerrada correctamente' }];
                });
            });
        };
        return AuthController_1;
    }());
    __setFunctionName(_classThis, "AuthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _checkToken_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({
                summary: 'Verificar Token',
                description: 'Verifica si el token JWT actual es válido y devuelve los datos del usuario.',
            }), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Post)('check-token')];
        _login_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Iniciar Sesión',
                description: 'Inicia sesión con de usuario y contraseña para obtener un token JWT.',
            }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'Inicio de sesión exitoso, retorna el token.',
            }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Credenciales inválidas.' }), (0, common_1.Post)('login')];
        _register_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Registrar nuevo usuario',
                description: 'Registra a un nuevo usuario cliente en la plataforma.',
            }), (0, common_1.Post)('register')];
        _googleLogin_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Iniciar sesión con Google' }), (0, common_1.Post)('google')];
        _getProfile_decorators = [(0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({
                summary: 'Obtener mi perfil',
                description: 'Devuelve los detalles básicos del usuario que está conectado (según el token).',
            }), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')), (0, common_1.Get)('me')];
        _resetPassword_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Restablecer Contraseña' }), (0, common_1.Put)('reset-password'), (0, common_1.UsePipes)(new common_1.ValidationPipe())];
        _forgotPassword_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Solicitar recuperación de contraseña (Olvidé mi contraseña)',
            }), (0, common_1.Post)('forgot-password')];
        _logout_decorators = [(0, swagger_1.ApiOperation)({
                summary: 'Cerrar Sesión',
                description: 'Elimina la cookie de autenticación del usuario.',
            }), (0, common_1.Post)('logout')];
        __esDecorate(_classThis, null, _checkToken_decorators, { kind: "method", name: "checkToken", static: false, private: false, access: { has: function (obj) { return "checkToken" in obj; }, get: function (obj) { return obj.checkToken; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: function (obj) { return "login" in obj; }, get: function (obj) { return obj.login; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _register_decorators, { kind: "method", name: "register", static: false, private: false, access: { has: function (obj) { return "register" in obj; }, get: function (obj) { return obj.register; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _googleLogin_decorators, { kind: "method", name: "googleLogin", static: false, private: false, access: { has: function (obj) { return "googleLogin" in obj; }, get: function (obj) { return obj.googleLogin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProfile_decorators, { kind: "method", name: "getProfile", static: false, private: false, access: { has: function (obj) { return "getProfile" in obj; }, get: function (obj) { return obj.getProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetPassword_decorators, { kind: "method", name: "resetPassword", static: false, private: false, access: { has: function (obj) { return "resetPassword" in obj; }, get: function (obj) { return obj.resetPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _forgotPassword_decorators, { kind: "method", name: "forgotPassword", static: false, private: false, access: { has: function (obj) { return "forgotPassword" in obj; }, get: function (obj) { return obj.forgotPassword; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logout_decorators, { kind: "method", name: "logout", static: false, private: false, access: { has: function (obj) { return "logout" in obj; }, get: function (obj) { return obj.logout; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
}();
exports.AuthController = AuthController;
