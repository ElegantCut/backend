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
exports.CreateAppointmentDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateAppointmentDto = function () {
    var _a;
    var _fecha_decorators;
    var _fecha_initializers = [];
    var _fecha_extraInitializers = [];
    var _observaciones_decorators;
    var _observaciones_initializers = [];
    var _observaciones_extraInitializers = [];
    var _email_contacto_decorators;
    var _email_contacto_initializers = [];
    var _email_contacto_extraInitializers = [];
    var _nombre_contacto_decorators;
    var _nombre_contacto_initializers = [];
    var _nombre_contacto_extraInitializers = [];
    var _id_usuario_decorators;
    var _id_usuario_initializers = [];
    var _id_usuario_extraInitializers = [];
    var _id_empleado_decorators;
    var _id_empleado_initializers = [];
    var _id_empleado_extraInitializers = [];
    var _id_estado_cita_decorators;
    var _id_estado_cita_initializers = [];
    var _id_estado_cita_extraInitializers = [];
    var _id_horarios_decorators;
    var _id_horarios_initializers = [];
    var _id_horarios_extraInitializers = [];
    var _id_servicio_decorators;
    var _id_servicio_initializers = [];
    var _id_servicio_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateAppointmentDto() {
                this.fecha = __runInitializers(this, _fecha_initializers, void 0);
                this.observaciones = (__runInitializers(this, _fecha_extraInitializers), __runInitializers(this, _observaciones_initializers, void 0));
                this.email_contacto = (__runInitializers(this, _observaciones_extraInitializers), __runInitializers(this, _email_contacto_initializers, void 0));
                this.nombre_contacto = (__runInitializers(this, _email_contacto_extraInitializers), __runInitializers(this, _nombre_contacto_initializers, void 0));
                this.id_usuario = (__runInitializers(this, _nombre_contacto_extraInitializers), __runInitializers(this, _id_usuario_initializers, void 0)); // El cliente
                this.id_empleado = (__runInitializers(this, _id_usuario_extraInitializers), __runInitializers(this, _id_empleado_initializers, void 0)); // El barbero (que también está en la tabla usuarios)
                this.id_estado_cita = (__runInitializers(this, _id_empleado_extraInitializers), __runInitializers(this, _id_estado_cita_initializers, void 0)); // Ej: 1 para 'Pendiente'
                this.id_horarios = (__runInitializers(this, _id_estado_cita_extraInitializers), __runInitializers(this, _id_horarios_initializers, void 0)); // El bloque de tiempo elegido
                this.id_servicio = (__runInitializers(this, _id_horarios_extraInitializers), __runInitializers(this, _id_servicio_initializers, void 0)); // El servicio (corte, barba, etc.)
                __runInitializers(this, _id_servicio_extraInitializers);
            }
            return CreateAppointmentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fecha_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Fecha de la cita en formato YYYY-MM-DD',
                    example: '2023-12-05',
                }), (0, class_validator_1.IsDateString)({}, { message: 'La fecha debe ser un formato válido (YYYY-MM-DD)' }), (0, class_validator_1.IsNotEmpty)()];
            _observaciones_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Notas adicionales sobre la cita',
                    example: 'Por favor, puntuales.',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _email_contacto_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Email directo del contacto ingresado en el formulario',
                    example: 'tucorreo@ejemplo.com',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _nombre_contacto_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Nombre directo del contacto ingresado en el formulario',
                    example: 'Juan Pérez',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _id_usuario_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'ID del usuario (cliente) que reserva',
                    example: 1,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _id_empleado_decorators = [(0, swagger_1.ApiProperty)({ description: 'ID del barbero asignado a la cita', example: 2 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _id_estado_cita_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Estado inicial de la cita. 1 = Pendiente',
                    example: 1,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _id_horarios_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'ID del bloque horario seleccionado',
                    example: 3,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            _id_servicio_decorators = [(0, swagger_1.ApiProperty)({ description: 'ID del servicio seleccionado', example: 1 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)()];
            __esDecorate(null, null, _fecha_decorators, { kind: "field", name: "fecha", static: false, private: false, access: { has: function (obj) { return "fecha" in obj; }, get: function (obj) { return obj.fecha; }, set: function (obj, value) { obj.fecha = value; } }, metadata: _metadata }, _fecha_initializers, _fecha_extraInitializers);
            __esDecorate(null, null, _observaciones_decorators, { kind: "field", name: "observaciones", static: false, private: false, access: { has: function (obj) { return "observaciones" in obj; }, get: function (obj) { return obj.observaciones; }, set: function (obj, value) { obj.observaciones = value; } }, metadata: _metadata }, _observaciones_initializers, _observaciones_extraInitializers);
            __esDecorate(null, null, _email_contacto_decorators, { kind: "field", name: "email_contacto", static: false, private: false, access: { has: function (obj) { return "email_contacto" in obj; }, get: function (obj) { return obj.email_contacto; }, set: function (obj, value) { obj.email_contacto = value; } }, metadata: _metadata }, _email_contacto_initializers, _email_contacto_extraInitializers);
            __esDecorate(null, null, _nombre_contacto_decorators, { kind: "field", name: "nombre_contacto", static: false, private: false, access: { has: function (obj) { return "nombre_contacto" in obj; }, get: function (obj) { return obj.nombre_contacto; }, set: function (obj, value) { obj.nombre_contacto = value; } }, metadata: _metadata }, _nombre_contacto_initializers, _nombre_contacto_extraInitializers);
            __esDecorate(null, null, _id_usuario_decorators, { kind: "field", name: "id_usuario", static: false, private: false, access: { has: function (obj) { return "id_usuario" in obj; }, get: function (obj) { return obj.id_usuario; }, set: function (obj, value) { obj.id_usuario = value; } }, metadata: _metadata }, _id_usuario_initializers, _id_usuario_extraInitializers);
            __esDecorate(null, null, _id_empleado_decorators, { kind: "field", name: "id_empleado", static: false, private: false, access: { has: function (obj) { return "id_empleado" in obj; }, get: function (obj) { return obj.id_empleado; }, set: function (obj, value) { obj.id_empleado = value; } }, metadata: _metadata }, _id_empleado_initializers, _id_empleado_extraInitializers);
            __esDecorate(null, null, _id_estado_cita_decorators, { kind: "field", name: "id_estado_cita", static: false, private: false, access: { has: function (obj) { return "id_estado_cita" in obj; }, get: function (obj) { return obj.id_estado_cita; }, set: function (obj, value) { obj.id_estado_cita = value; } }, metadata: _metadata }, _id_estado_cita_initializers, _id_estado_cita_extraInitializers);
            __esDecorate(null, null, _id_horarios_decorators, { kind: "field", name: "id_horarios", static: false, private: false, access: { has: function (obj) { return "id_horarios" in obj; }, get: function (obj) { return obj.id_horarios; }, set: function (obj, value) { obj.id_horarios = value; } }, metadata: _metadata }, _id_horarios_initializers, _id_horarios_extraInitializers);
            __esDecorate(null, null, _id_servicio_decorators, { kind: "field", name: "id_servicio", static: false, private: false, access: { has: function (obj) { return "id_servicio" in obj; }, get: function (obj) { return obj.id_servicio; }, set: function (obj, value) { obj.id_servicio = value; } }, metadata: _metadata }, _id_servicio_initializers, _id_servicio_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateAppointmentDto = CreateAppointmentDto;
