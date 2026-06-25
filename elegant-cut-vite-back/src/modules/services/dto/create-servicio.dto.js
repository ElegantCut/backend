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
exports.CrearServicioDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CrearServicioDto = function () {
    var _a;
    var _nombre_decorators;
    var _nombre_initializers = [];
    var _nombre_extraInitializers = [];
    var _precio_decorators;
    var _precio_initializers = [];
    var _precio_extraInitializers = [];
    var _duracion_decorators;
    var _duracion_initializers = [];
    var _duracion_extraInitializers = [];
    var _descripcion_decorators;
    var _descripcion_initializers = [];
    var _descripcion_extraInitializers = [];
    var _id_categoria_decorators;
    var _id_categoria_initializers = [];
    var _id_categoria_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CrearServicioDto() {
                this.nombre = __runInitializers(this, _nombre_initializers, void 0);
                this.precio = (__runInitializers(this, _nombre_extraInitializers), __runInitializers(this, _precio_initializers, void 0));
                /**
                 * Duración del servicio en minutos.
                 * Ejemplo: 40 para un servicio que dura 40 minutos.
                 */
                this.duracion = (__runInitializers(this, _precio_extraInitializers), __runInitializers(this, _duracion_initializers, void 0));
                this.descripcion = (__runInitializers(this, _duracion_extraInitializers), __runInitializers(this, _descripcion_initializers, void 0));
                this.id_categoria = (__runInitializers(this, _descripcion_extraInitializers), __runInitializers(this, _id_categoria_initializers, void 0));
                __runInitializers(this, _id_categoria_extraInitializers);
            }
            return CrearServicioDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _nombre_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Nombre del servicio a ofrecer',
                    example: 'Corte de Cabello',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'El nombre del servicio es obligatorio' })];
            _precio_decorators = [(0, swagger_1.ApiProperty)({ description: 'Precio base del servicio', example: 15000 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsPositive)({ message: 'El precio debe ser un número positivo' })];
            _duracion_decorators = [(0, swagger_1.ApiProperty)({ description: 'Duración estimada en minutos', example: 45 }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsPositive)({
                    message: 'La duración debe ser un número positivo (ejemplo: 40)',
                })];
            _descripcion_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Descripción detallada del servicio',
                    example: 'Corte moderno con degradado',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)({ message: 'La descripción es obligatoria' })];
            _id_categoria_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'ID de la categoría a la que pertenece',
                    example: 1,
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsNotEmpty)({ message: 'La categoría es obligatoria' })];
            __esDecorate(null, null, _nombre_decorators, { kind: "field", name: "nombre", static: false, private: false, access: { has: function (obj) { return "nombre" in obj; }, get: function (obj) { return obj.nombre; }, set: function (obj, value) { obj.nombre = value; } }, metadata: _metadata }, _nombre_initializers, _nombre_extraInitializers);
            __esDecorate(null, null, _precio_decorators, { kind: "field", name: "precio", static: false, private: false, access: { has: function (obj) { return "precio" in obj; }, get: function (obj) { return obj.precio; }, set: function (obj, value) { obj.precio = value; } }, metadata: _metadata }, _precio_initializers, _precio_extraInitializers);
            __esDecorate(null, null, _duracion_decorators, { kind: "field", name: "duracion", static: false, private: false, access: { has: function (obj) { return "duracion" in obj; }, get: function (obj) { return obj.duracion; }, set: function (obj, value) { obj.duracion = value; } }, metadata: _metadata }, _duracion_initializers, _duracion_extraInitializers);
            __esDecorate(null, null, _descripcion_decorators, { kind: "field", name: "descripcion", static: false, private: false, access: { has: function (obj) { return "descripcion" in obj; }, get: function (obj) { return obj.descripcion; }, set: function (obj, value) { obj.descripcion = value; } }, metadata: _metadata }, _descripcion_initializers, _descripcion_extraInitializers);
            __esDecorate(null, null, _id_categoria_decorators, { kind: "field", name: "id_categoria", static: false, private: false, access: { has: function (obj) { return "id_categoria" in obj; }, get: function (obj) { return obj.id_categoria; }, set: function (obj, value) { obj.id_categoria = value; } }, metadata: _metadata }, _id_categoria_initializers, _id_categoria_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CrearServicioDto = CrearServicioDto;
