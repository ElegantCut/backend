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
exports.CrearUsuarioDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CrearUsuarioDto = function () {
    var _a;
    var _username_decorators;
    var _username_initializers = [];
    var _username_extraInitializers = [];
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
    var _password_hash_decorators;
    var _password_hash_initializers = [];
    var _password_hash_extraInitializers = [];
    var _telefono_decorators;
    var _telefono_initializers = [];
    var _telefono_extraInitializers = [];
    var _estado_decorators;
    var _estado_initializers = [];
    var _estado_extraInitializers = [];
    var _id_rol_decorators;
    var _id_rol_initializers = [];
    var _id_rol_extraInitializers = [];
    var _foto_perfil_decorators;
    var _foto_perfil_initializers = [];
    var _foto_perfil_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CrearUsuarioDto() {
                this.username = __runInitializers(this, _username_initializers, void 0);
                this.prim_nombre = (__runInitializers(this, _username_extraInitializers), __runInitializers(this, _prim_nombre_initializers, void 0));
                this.seg_nombre = (__runInitializers(this, _prim_nombre_extraInitializers), __runInitializers(this, _seg_nombre_initializers, void 0));
                this.apellido1 = (__runInitializers(this, _seg_nombre_extraInitializers), __runInitializers(this, _apellido1_initializers, void 0));
                this.apellido2 = (__runInitializers(this, _apellido1_extraInitializers), __runInitializers(this, _apellido2_initializers, void 0));
                this.email = (__runInitializers(this, _apellido2_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.password_hash = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_hash_initializers, void 0));
                this.telefono = (__runInitializers(this, _password_hash_extraInitializers), __runInitializers(this, _telefono_initializers, void 0));
                this.estado = (__runInitializers(this, _telefono_extraInitializers), __runInitializers(this, _estado_initializers, void 0));
                this.id_rol = (__runInitializers(this, _estado_extraInitializers), __runInitializers(this, _id_rol_initializers, void 0));
                this.foto_perfil = (__runInitializers(this, _id_rol_extraInitializers), __runInitializers(this, _foto_perfil_initializers, void 0));
                __runInitializers(this, _foto_perfil_extraInitializers);
            }
            return CrearUsuarioDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _username_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Nombre de usuario único para el login',
                    example: 'juan123',
                }), (0, class_validator_1.IsString)()];
            _prim_nombre_decorators = [(0, swagger_1.ApiProperty)({ description: 'Primer nombre del usuario', example: 'Juan' }), (0, class_validator_1.IsString)()];
            _seg_nombre_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Segundo nombre del usuario (opcional)',
                    example: 'Carlos',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _apellido1_decorators = [(0, swagger_1.ApiProperty)({ description: 'Primer apellido del usuario', example: 'Pérez' }), (0, class_validator_1.IsString)()];
            _apellido2_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Segundo apellido del usuario (opcional)',
                    example: 'Gómez',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _email_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Correo electrónico del usuario',
                    example: 'juan.perez@example.com',
                }), (0, class_validator_1.IsEmail)({}, { message: 'El correo electrónico no es válido' })];
            _password_hash_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Contraseña en texto plano (será encriptada por el backend)',
                    example: 'MiPasswordSeguro123',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(8, { message: 'La contraseña debe tener al menos 8 caracteres' }), (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es obligatoria' })];
            _telefono_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Número de teléfono del usuario',
                    example: '3001234567',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _estado_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Estado de la cuenta. true=Activo, false=Inactivo',
                    example: true,
                    default: true,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _id_rol_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'ID del rol asignado. 1=Admin, 2=Cliente, 3=Barbero',
                    example: 2,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _foto_perfil_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'URL de la foto de perfil (generalmente desde Cloudinary)',
                    example: 'https://res.cloudinary.com/mi-cloud/image/upload/v1234/foto.jpg',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _username_decorators, { kind: "field", name: "username", static: false, private: false, access: { has: function (obj) { return "username" in obj; }, get: function (obj) { return obj.username; }, set: function (obj, value) { obj.username = value; } }, metadata: _metadata }, _username_initializers, _username_extraInitializers);
            __esDecorate(null, null, _prim_nombre_decorators, { kind: "field", name: "prim_nombre", static: false, private: false, access: { has: function (obj) { return "prim_nombre" in obj; }, get: function (obj) { return obj.prim_nombre; }, set: function (obj, value) { obj.prim_nombre = value; } }, metadata: _metadata }, _prim_nombre_initializers, _prim_nombre_extraInitializers);
            __esDecorate(null, null, _seg_nombre_decorators, { kind: "field", name: "seg_nombre", static: false, private: false, access: { has: function (obj) { return "seg_nombre" in obj; }, get: function (obj) { return obj.seg_nombre; }, set: function (obj, value) { obj.seg_nombre = value; } }, metadata: _metadata }, _seg_nombre_initializers, _seg_nombre_extraInitializers);
            __esDecorate(null, null, _apellido1_decorators, { kind: "field", name: "apellido1", static: false, private: false, access: { has: function (obj) { return "apellido1" in obj; }, get: function (obj) { return obj.apellido1; }, set: function (obj, value) { obj.apellido1 = value; } }, metadata: _metadata }, _apellido1_initializers, _apellido1_extraInitializers);
            __esDecorate(null, null, _apellido2_decorators, { kind: "field", name: "apellido2", static: false, private: false, access: { has: function (obj) { return "apellido2" in obj; }, get: function (obj) { return obj.apellido2; }, set: function (obj, value) { obj.apellido2 = value; } }, metadata: _metadata }, _apellido2_initializers, _apellido2_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _password_hash_decorators, { kind: "field", name: "password_hash", static: false, private: false, access: { has: function (obj) { return "password_hash" in obj; }, get: function (obj) { return obj.password_hash; }, set: function (obj, value) { obj.password_hash = value; } }, metadata: _metadata }, _password_hash_initializers, _password_hash_extraInitializers);
            __esDecorate(null, null, _telefono_decorators, { kind: "field", name: "telefono", static: false, private: false, access: { has: function (obj) { return "telefono" in obj; }, get: function (obj) { return obj.telefono; }, set: function (obj, value) { obj.telefono = value; } }, metadata: _metadata }, _telefono_initializers, _telefono_extraInitializers);
            __esDecorate(null, null, _estado_decorators, { kind: "field", name: "estado", static: false, private: false, access: { has: function (obj) { return "estado" in obj; }, get: function (obj) { return obj.estado; }, set: function (obj, value) { obj.estado = value; } }, metadata: _metadata }, _estado_initializers, _estado_extraInitializers);
            __esDecorate(null, null, _id_rol_decorators, { kind: "field", name: "id_rol", static: false, private: false, access: { has: function (obj) { return "id_rol" in obj; }, get: function (obj) { return obj.id_rol; }, set: function (obj, value) { obj.id_rol = value; } }, metadata: _metadata }, _id_rol_initializers, _id_rol_extraInitializers);
            __esDecorate(null, null, _foto_perfil_decorators, { kind: "field", name: "foto_perfil", static: false, private: false, access: { has: function (obj) { return "foto_perfil" in obj; }, get: function (obj) { return obj.foto_perfil; }, set: function (obj, value) { obj.foto_perfil = value; } }, metadata: _metadata }, _foto_perfil_initializers, _foto_perfil_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CrearUsuarioDto = CrearUsuarioDto;
