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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBarberDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateBarberDto = function () {
    var _a;
    var _prim_nombre_decorators;
    var _prim_nombre_initializers = [];
    var _prim_nombre_extraInitializers = [];
    var _seg_nombre_decorators;
    var _seg_nombre_initializers = [];
    var _seg_nombre_extraInitializers = [];
    var _apellido1_decorators;
    var _apellido1_initializers = [];
    var _apellido1_extraInitializers = [];
    var _apellido2_decorators;
    var _apellido2_initializers = [];
    var _apellido2_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _username_decorators;
    var _username_initializers = [];
    var _username_extraInitializers = [];
    var _password_hash_decorators;
    var _password_hash_initializers = [];
    var _password_hash_extraInitializers = [];
    var _telefono_decorators;
    var _telefono_initializers = [];
    var _telefono_extraInitializers = [];
    var _biografia_decorators;
    var _biografia_initializers = [];
    var _biografia_extraInitializers = [];
    var _experiencia_decorators;
    var _experiencia_initializers = [];
    var _experiencia_extraInitializers = [];
    var _especialidades_decorators;
    var _especialidades_initializers = [];
    var _especialidades_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateBarberDto() {
                this.prim_nombre = __runInitializers(this, _prim_nombre_initializers, void 0);
                this.seg_nombre = (__runInitializers(this, _prim_nombre_extraInitializers), __runInitializers(this, _seg_nombre_initializers, void 0));
                this.apellido1 = (__runInitializers(this, _seg_nombre_extraInitializers), __runInitializers(this, _apellido1_initializers, void 0));
                this.apellido2 = (__runInitializers(this, _apellido1_extraInitializers), __runInitializers(this, _apellido2_initializers, void 0));
                this.email = (__runInitializers(this, _apellido2_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.username = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _username_initializers, void 0));
                this.password_hash = (__runInitializers(this, _username_extraInitializers), __runInitializers(this, _password_hash_initializers, void 0));
                this.telefono = (__runInitializers(this, _password_hash_extraInitializers), __runInitializers(this, _telefono_initializers, void 0));
                this.biografia = (__runInitializers(this, _telefono_extraInitializers), __runInitializers(this, _biografia_initializers, void 0));
                this.experiencia = (__runInitializers(this, _biografia_extraInitializers), __runInitializers(this, _experiencia_initializers, void 0));
                this.especialidades = (__runInitializers(this, _experiencia_extraInitializers), __runInitializers(this, _especialidades_initializers, void 0));
                __runInitializers(this, _especialidades_extraInitializers);
            }
            return CreateBarberDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _prim_nombre_decorators = [(0, swagger_1.ApiProperty)({ description: 'Primer nombre del barbero', example: 'Pedro' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'El primer nombre es obligatorio' })];
            _seg_nombre_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Segundo nombre del barbero',
                    example: 'Antonio',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _apellido1_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Primer apellido del barbero',
                    example: 'Martínez',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'El primer apellido es obligatorio' })];
            _apellido2_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Segundo apellido del barbero',
                    example: 'Gómez',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _email_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Correo electrónico único',
                    example: 'pedro.barber@elegantcut.com',
                }), (0, class_validator_1.IsEmail)({}, { message: 'Debe ser un correo electrónico válido' }), (0, class_validator_1.IsNotEmpty)({ message: 'El correo electrónico es obligatorio' })];
            _username_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Nombre de usuario',
                    example: 'pedromtz',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _password_hash_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Contraseña del barbero',
                    example: 'Secreta123',
                    minLength: 6,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es obligatoria' }), (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres' })];
            _telefono_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Teléfono de contacto',
                    example: '3201234567',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _biografia_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Biografía para el portafolio del barbero',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _experiencia_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Experiencia del barbero' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _especialidades_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Especialidades del barbero, e.g. ["Corte Clasico", "Barba"]',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _prim_nombre_decorators, { kind: "field", name: "prim_nombre", static: false, private: false, access: { has: function (obj) { return "prim_nombre" in obj; }, get: function (obj) { return obj.prim_nombre; }, set: function (obj, value) { obj.prim_nombre = value; } }, metadata: _metadata }, _prim_nombre_initializers, _prim_nombre_extraInitializers);
            __esDecorate(null, null, _seg_nombre_decorators, { kind: "field", name: "seg_nombre", static: false, private: false, access: { has: function (obj) { return "seg_nombre" in obj; }, get: function (obj) { return obj.seg_nombre; }, set: function (obj, value) { obj.seg_nombre = value; } }, metadata: _metadata }, _seg_nombre_initializers, _seg_nombre_extraInitializers);
            __esDecorate(null, null, _apellido1_decorators, { kind: "field", name: "apellido1", static: false, private: false, access: { has: function (obj) { return "apellido1" in obj; }, get: function (obj) { return obj.apellido1; }, set: function (obj, value) { obj.apellido1 = value; } }, metadata: _metadata }, _apellido1_initializers, _apellido1_extraInitializers);
            __esDecorate(null, null, _apellido2_decorators, { kind: "field", name: "apellido2", static: false, private: false, access: { has: function (obj) { return "apellido2" in obj; }, get: function (obj) { return obj.apellido2; }, set: function (obj, value) { obj.apellido2 = value; } }, metadata: _metadata }, _apellido2_initializers, _apellido2_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _username_decorators, { kind: "field", name: "username", static: false, private: false, access: { has: function (obj) { return "username" in obj; }, get: function (obj) { return obj.username; }, set: function (obj, value) { obj.username = value; } }, metadata: _metadata }, _username_initializers, _username_extraInitializers);
            __esDecorate(null, null, _password_hash_decorators, { kind: "field", name: "password_hash", static: false, private: false, access: { has: function (obj) { return "password_hash" in obj; }, get: function (obj) { return obj.password_hash; }, set: function (obj, value) { obj.password_hash = value; } }, metadata: _metadata }, _password_hash_initializers, _password_hash_extraInitializers);
            __esDecorate(null, null, _telefono_decorators, { kind: "field", name: "telefono", static: false, private: false, access: { has: function (obj) { return "telefono" in obj; }, get: function (obj) { return obj.telefono; }, set: function (obj, value) { obj.telefono = value; } }, metadata: _metadata }, _telefono_initializers, _telefono_extraInitializers);
            __esDecorate(null, null, _biografia_decorators, { kind: "field", name: "biografia", static: false, private: false, access: { has: function (obj) { return "biografia" in obj; }, get: function (obj) { return obj.biografia; }, set: function (obj, value) { obj.biografia = value; } }, metadata: _metadata }, _biografia_initializers, _biografia_extraInitializers);
            __esDecorate(null, null, _experiencia_decorators, { kind: "field", name: "experiencia", static: false, private: false, access: { has: function (obj) { return "experiencia" in obj; }, get: function (obj) { return obj.experiencia; }, set: function (obj, value) { obj.experiencia = value; } }, metadata: _metadata }, _experiencia_initializers, _experiencia_extraInitializers);
            __esDecorate(null, null, _especialidades_decorators, { kind: "field", name: "especialidades", static: false, private: false, access: { has: function (obj) { return "especialidades" in obj; }, get: function (obj) { return obj.especialidades; }, set: function (obj, value) { obj.especialidades = value; } }, metadata: _metadata }, _especialidades_initializers, _especialidades_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateBarberDto = CreateBarberDto;
