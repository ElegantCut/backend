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
exports.EmailService = void 0;
var common_1 = require("@nestjs/common");
var nodemailer = require("nodemailer");
var EmailService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EmailService = _classThis = /** @class */ (function () {
        function EmailService_1(configService) {
            this.configService = configService;
        }
        /**
         * Crea el transporter en el momento del envío (no en el constructor),
         * para garantizar que las variables de entorno ya estén cargadas.
         */
        EmailService_1.prototype.createTransporter = function () {
            var user = this.configService.get('EMAIL_USER');
            // Quitar los espacios del App Password (Google a veces los rechaza si se envían con espacios)
            var rawPass = this.configService.get('EMAIL_PASS') || '';
            var pass = rawPass.replace(/\s+/g, '');
            console.log("[EMAIL] Configurando transporter con usuario: ".concat(user ? user : '⚠️ NO DEFINIDO'));
            return nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: { user: user, pass: pass },
                tls: {
                    // Esto ayuda si Docker tiene problemas con los certificados raíz
                    rejectUnauthorized: false,
                },
            });
        };
        EmailService_1.prototype.sendVerificationCode = function (email, code) {
            return __awaiter(this, void 0, void 0, function () {
                var emailUser, emailPass, transporter, mailOptions, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            emailUser = this.configService.get('EMAIL_USER');
                            emailPass = this.configService.get('EMAIL_PASS');
                            console.log("[EMAIL] Iniciando env\u00EDo de c\u00F3digo ".concat(code, " a ").concat(email));
                            console.log("[EMAIL] EMAIL_USER configurado: ".concat(emailUser ? '✅ SÍ' : '❌ NO'));
                            console.log("[EMAIL] EMAIL_PASS configurado: ".concat(emailPass ? '✅ SÍ' : '❌ NO'));
                            if (!emailUser || !emailPass) {
                                console.error('❌ [EMAIL] Credenciales no configuradas. Revisa EMAIL_USER y EMAIL_PASS en el .env');
                                return [2 /*return*/, false];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            transporter = this.createTransporter();
                            mailOptions = {
                                from: "\"Elegant Cut\" <".concat(emailUser, ">"),
                                to: email,
                                subject: 'Código de Verificación - Elegant Cut',
                                html: "\n          <div style=\"font-family: Arial, sans-serif; padding: 20px;\">\n            <h2>Verificaci\u00F3n de Seguridad</h2>\n            <p>Tu c\u00F3digo de verificaci\u00F3n es:</p>\n            <h1 style=\"color: #BC2041; letter-spacing: 5px;\">".concat(code, "</h1>\n            <p>Este c\u00F3digo expirar\u00E1 en 15 minutos.</p>\n            <p>Si no solicitaste este c\u00F3digo, ignora este correo.</p>\n          </div>\n        "),
                            };
                            return [4 /*yield*/, transporter.sendMail(mailOptions)];
                        case 2:
                            _b.sent();
                            console.log("[EMAIL] \u2705 Correo enviado exitosamente a ".concat(email));
                            return [2 /*return*/, true];
                        case 3:
                            error_1 = _b.sent();
                            console.error('❌ [EMAIL] Error al enviar correo:');
                            console.error("   Mensaje: ".concat(error_1.message));
                            console.error("   C\u00F3digo:  ".concat(error_1.code));
                            console.error("   Detalle: ".concat(JSON.stringify((_a = error_1.response) !== null && _a !== void 0 ? _a : '')));
                            // Lanza el error para que el endpoint devuelva 500 en lugar de fingir éxito
                            throw new common_1.InternalServerErrorException("No se pudo enviar el correo: ".concat(error_1.message));
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        EmailService_1.prototype.sendPqrsConfirmation = function (email, userName, radicado, type) {
            return __awaiter(this, void 0, void 0, function () {
                var emailUser, emailPass, transporter, message, mailOptions, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            emailUser = this.configService.get('EMAIL_USER');
                            emailPass = this.configService.get('EMAIL_PASS');
                            if (!emailUser || !emailPass) {
                                console.error('❌ [EMAIL] Credenciales no configuradas para PQRS.');
                                return [2 /*return*/, false];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            transporter = this.createTransporter();
                            message = type === 'peticion'
                                ? '¡Tu petición fue exitosa!'
                                : type === 'queja'
                                    ? '¡Tu queja fue exitosa!'
                                    : "Tu ".concat(type, " ha sido radicada exitosamente.");
                            mailOptions = {
                                from: "\"Elegant Cut\" <".concat(emailUser, ">"),
                                to: email,
                                subject: "Confirmaci\u00F3n de PQRS - ".concat(radicado),
                                html: "\n          <div style=\"font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;\">\n            <h2 style=\"color: #BC2041;\">Elegant Cut</h2>\n            <h3>".concat(message, "</h3>\n            <p>Hola <strong>").concat(userName, "</strong>,</p>\n            <p>Hemos recibido tu solicitud correctamente.</p>\n            <p><strong>N\u00FAmero de Radicado:</strong> ").concat(radicado, "</p>\n            <br>\n            <p>Gracias por contactarnos.</p>\n          </div>\n        "),
                            };
                            return [4 /*yield*/, transporter.sendMail(mailOptions)];
                        case 2:
                            _a.sent();
                            console.log("[EMAIL] \u2705 Confirmaci\u00F3n PQRS enviada a ".concat(email));
                            return [2 /*return*/, true];
                        case 3:
                            error_2 = _a.sent();
                            console.error('❌ [EMAIL] Error en confirmación PQRS:');
                            console.error("   Mensaje: ".concat(error_2.message));
                            console.error("   C\u00F3digo:  ".concat(error_2.code));
                            return [2 /*return*/, false];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return EmailService_1;
    }());
    __setFunctionName(_classThis, "EmailService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EmailService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EmailService = _classThis;
}();
exports.EmailService = EmailService;
