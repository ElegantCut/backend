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
exports.CrearPqrsDto = exports.PqrsMedioRespuesta = exports.PqrsTipoSolicitud = void 0;
var class_validator_1 = require("class-validator"); //importa decoradores de class-validator
var swagger_1 = require("@nestjs/swagger");
var PqrsTipoSolicitud;
(function (PqrsTipoSolicitud) {
    PqrsTipoSolicitud["peticion"] = "Peticion";
    PqrsTipoSolicitud["queja"] = "Queja";
    PqrsTipoSolicitud["reclamo"] = "Reclamo";
    PqrsTipoSolicitud["sugerencia"] = "Sugerencia";
})(PqrsTipoSolicitud || (exports.PqrsTipoSolicitud = PqrsTipoSolicitud = {}));
var PqrsMedioRespuesta;
(function (PqrsMedioRespuesta) {
    PqrsMedioRespuesta["email"] = "email";
    PqrsMedioRespuesta["telefono"] = "telefono";
    PqrsMedioRespuesta["mail"] = "mail";
})(PqrsMedioRespuesta || (exports.PqrsMedioRespuesta = PqrsMedioRespuesta = {}));
var CrearPqrsDto = function () {
    var _a;
    var _id_usuario_decorators;
    var _id_usuario_initializers = [];
    var _id_usuario_extraInitializers = [];
    var _tipo_solicitud_decorators;
    var _tipo_solicitud_initializers = [];
    var _tipo_solicitud_extraInitializers = [];
    var _nombre_completo_decorators;
    var _nombre_completo_initializers = [];
    var _nombre_completo_extraInitializers = [];
    var _identificacion_decorators;
    var _identificacion_initializers = [];
    var _identificacion_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _telefono_decorators;
    var _telefono_initializers = [];
    var _telefono_extraInitializers = [];
    var _asunto_decorators;
    var _asunto_initializers = [];
    var _asunto_extraInitializers = [];
    var _descripcion_decorators;
    var _descripcion_initializers = [];
    var _descripcion_extraInitializers = [];
    var _medio_respuesta_decorators;
    var _medio_respuesta_initializers = [];
    var _medio_respuesta_extraInitializers = [];
    var _estado_decorators;
    var _estado_initializers = [];
    var _estado_extraInitializers = [];
    var _respuesta_decorators;
    var _respuesta_initializers = [];
    var _respuesta_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CrearPqrsDto() {
                this.id_usuario = __runInitializers(this, _id_usuario_initializers, void 0);
                this.tipo_solicitud = (__runInitializers(this, _id_usuario_extraInitializers), __runInitializers(this, _tipo_solicitud_initializers, void 0));
                //todos los que tienen  el @ son decoradores de class-validator
                this.nombre_completo = (__runInitializers(this, _tipo_solicitud_extraInitializers), __runInitializers(this, _nombre_completo_initializers, void 0));
                this.identificacion = (__runInitializers(this, _nombre_completo_extraInitializers), __runInitializers(this, _identificacion_initializers, void 0));
                this.email = (__runInitializers(this, _identificacion_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.telefono = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _telefono_initializers, void 0));
                this.asunto = (__runInitializers(this, _telefono_extraInitializers), __runInitializers(this, _asunto_initializers, void 0));
                this.descripcion = (__runInitializers(this, _asunto_extraInitializers), __runInitializers(this, _descripcion_initializers, void 0));
                this.medio_respuesta = (__runInitializers(this, _descripcion_extraInitializers), __runInitializers(this, _medio_respuesta_initializers, void 0));
                // Estos son opcionales porque al crear la PQRS suelen tener valores por defecto
                this.estado = (__runInitializers(this, _medio_respuesta_extraInitializers), __runInitializers(this, _estado_initializers, void 0));
                this.respuesta = (__runInitializers(this, _estado_extraInitializers), __runInitializers(this, _respuesta_initializers, void 0));
                __runInitializers(this, _respuesta_extraInitializers);
            }
            return CrearPqrsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_usuario_decorators = [(0, swagger_1.ApiProperty)({ description: 'ID del usuario asociado a la PQRS', example: 5 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _tipo_solicitud_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Tipo de la solicitud que se está radicando',
                    enum: PqrsTipoSolicitud,
                    example: PqrsTipoSolicitud.queja,
                }), (0, class_validator_1.IsEnum)(PqrsTipoSolicitud, {
                    message: 'El tipo debe ser: Peticion, Queja, Reclamo o Sugerencia',
                }), (0, class_validator_1.IsNotEmpty)()];
            _nombre_completo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Nombre completo de quien radica la solicitud',
                    example: 'Ana Lopez',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _identificacion_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Documento de identidad (Opcional)',
                    example: '10203040',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _email_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Correo electrónico para recibir respuesta',
                    example: 'ana@example.com',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _telefono_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Teléfono de contacto (Opcional)',
                    example: '3109876543',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _asunto_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Motivo abreviado de la solicitud',
                    example: 'Mala atención en sucursal',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _descripcion_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Detalle de la solicitud que explica la petición o queja',
                    example: 'Me atendieron 30 minutos tarde...',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _medio_respuesta_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Medio por el cual el cliente desea ser contactado',
                    enum: PqrsMedioRespuesta,
                    example: PqrsMedioRespuesta.email,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PqrsMedioRespuesta)];
            _estado_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Estado actual del caso (ignorado al crear)',
                    example: 'Pendiente',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _respuesta_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Respuesta brindada por el administrador (ignorado al crear)',
                    example: '',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_usuario_decorators, { kind: "field", name: "id_usuario", static: false, private: false, access: { has: function (obj) { return "id_usuario" in obj; }, get: function (obj) { return obj.id_usuario; }, set: function (obj, value) { obj.id_usuario = value; } }, metadata: _metadata }, _id_usuario_initializers, _id_usuario_extraInitializers);
            __esDecorate(null, null, _tipo_solicitud_decorators, { kind: "field", name: "tipo_solicitud", static: false, private: false, access: { has: function (obj) { return "tipo_solicitud" in obj; }, get: function (obj) { return obj.tipo_solicitud; }, set: function (obj, value) { obj.tipo_solicitud = value; } }, metadata: _metadata }, _tipo_solicitud_initializers, _tipo_solicitud_extraInitializers);
            __esDecorate(null, null, _nombre_completo_decorators, { kind: "field", name: "nombre_completo", static: false, private: false, access: { has: function (obj) { return "nombre_completo" in obj; }, get: function (obj) { return obj.nombre_completo; }, set: function (obj, value) { obj.nombre_completo = value; } }, metadata: _metadata }, _nombre_completo_initializers, _nombre_completo_extraInitializers);
            __esDecorate(null, null, _identificacion_decorators, { kind: "field", name: "identificacion", static: false, private: false, access: { has: function (obj) { return "identificacion" in obj; }, get: function (obj) { return obj.identificacion; }, set: function (obj, value) { obj.identificacion = value; } }, metadata: _metadata }, _identificacion_initializers, _identificacion_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _telefono_decorators, { kind: "field", name: "telefono", static: false, private: false, access: { has: function (obj) { return "telefono" in obj; }, get: function (obj) { return obj.telefono; }, set: function (obj, value) { obj.telefono = value; } }, metadata: _metadata }, _telefono_initializers, _telefono_extraInitializers);
            __esDecorate(null, null, _asunto_decorators, { kind: "field", name: "asunto", static: false, private: false, access: { has: function (obj) { return "asunto" in obj; }, get: function (obj) { return obj.asunto; }, set: function (obj, value) { obj.asunto = value; } }, metadata: _metadata }, _asunto_initializers, _asunto_extraInitializers);
            __esDecorate(null, null, _descripcion_decorators, { kind: "field", name: "descripcion", static: false, private: false, access: { has: function (obj) { return "descripcion" in obj; }, get: function (obj) { return obj.descripcion; }, set: function (obj, value) { obj.descripcion = value; } }, metadata: _metadata }, _descripcion_initializers, _descripcion_extraInitializers);
            __esDecorate(null, null, _medio_respuesta_decorators, { kind: "field", name: "medio_respuesta", static: false, private: false, access: { has: function (obj) { return "medio_respuesta" in obj; }, get: function (obj) { return obj.medio_respuesta; }, set: function (obj, value) { obj.medio_respuesta = value; } }, metadata: _metadata }, _medio_respuesta_initializers, _medio_respuesta_extraInitializers);
            __esDecorate(null, null, _estado_decorators, { kind: "field", name: "estado", static: false, private: false, access: { has: function (obj) { return "estado" in obj; }, get: function (obj) { return obj.estado; }, set: function (obj, value) { obj.estado = value; } }, metadata: _metadata }, _estado_initializers, _estado_extraInitializers);
            __esDecorate(null, null, _respuesta_decorators, { kind: "field", name: "respuesta", static: false, private: false, access: { has: function (obj) { return "respuesta" in obj; }, get: function (obj) { return obj.respuesta; }, set: function (obj, value) { obj.respuesta = value; } }, metadata: _metadata }, _respuesta_initializers, _respuesta_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CrearPqrsDto = CrearPqrsDto;
