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
exports.CreatePortaDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreatePortaDto = function () {
    var _a;
    var _id_usuario_decorators;
    var _id_usuario_initializers = [];
    var _id_usuario_extraInitializers = [];
    var _biografia_decorators;
    var _biografia_initializers = [];
    var _biografia_extraInitializers = [];
    var _experiencia_decorators;
    var _experiencia_initializers = [];
    var _experiencia_extraInitializers = [];
    var _especialidades_decorators;
    var _especialidades_initializers = [];
    var _especialidades_extraInitializers = [];
    var _instagram_decorators;
    var _instagram_initializers = [];
    var _instagram_extraInitializers = [];
    var _fotos_portafolio_decorators;
    var _fotos_portafolio_initializers = [];
    var _fotos_portafolio_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePortaDto() {
                this.id_usuario = __runInitializers(this, _id_usuario_initializers, void 0);
                this.biografia = (__runInitializers(this, _id_usuario_extraInitializers), __runInitializers(this, _biografia_initializers, void 0)); // Es TEXT en SQL
                this.experiencia = (__runInitializers(this, _biografia_extraInitializers), __runInitializers(this, _experiencia_initializers, void 0));
                this.especialidades = (__runInitializers(this, _experiencia_extraInitializers), __runInitializers(this, _especialidades_initializers, void 0));
                this.instagram = (__runInitializers(this, _especialidades_extraInitializers), __runInitializers(this, _instagram_initializers, void 0));
                this.fotos_portafolio = (__runInitializers(this, _instagram_extraInitializers), __runInitializers(this, _fotos_portafolio_initializers, void 0));
                __runInitializers(this, _fotos_portafolio_extraInitializers);
            }
            return CreatePortaDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_usuario_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'ID del usuario barbero asociado al portafolio',
                    example: 5,
                }), (0, class_validator_1.IsInt)(), (0, class_validator_1.IsNotEmpty)({ message: 'El id_usuario es obligatorio' })];
            _biografia_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Breve biografía del barbero',
                    example: 'Apasionado por los cortes clásicos.',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _experiencia_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Años o detalle de su experiencia',
                    example: '5 años de exp',
                    maxLength: 100,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(100)];
            _especialidades_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Lista de especialidades del barbero',
                    example: ['Fade', 'Perfilado de Barba', 'Colorimetría'],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _instagram_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Usuario o link a Instagram del barbero',
                    example: '@barber_elegant',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.MaxLength)(100)];
            _fotos_portafolio_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'URLs de las fotos de sus mejores cortes',
                    example: ['https://url.com/foto1.jpg'],
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _id_usuario_decorators, { kind: "field", name: "id_usuario", static: false, private: false, access: { has: function (obj) { return "id_usuario" in obj; }, get: function (obj) { return obj.id_usuario; }, set: function (obj, value) { obj.id_usuario = value; } }, metadata: _metadata }, _id_usuario_initializers, _id_usuario_extraInitializers);
            __esDecorate(null, null, _biografia_decorators, { kind: "field", name: "biografia", static: false, private: false, access: { has: function (obj) { return "biografia" in obj; }, get: function (obj) { return obj.biografia; }, set: function (obj, value) { obj.biografia = value; } }, metadata: _metadata }, _biografia_initializers, _biografia_extraInitializers);
            __esDecorate(null, null, _experiencia_decorators, { kind: "field", name: "experiencia", static: false, private: false, access: { has: function (obj) { return "experiencia" in obj; }, get: function (obj) { return obj.experiencia; }, set: function (obj, value) { obj.experiencia = value; } }, metadata: _metadata }, _experiencia_initializers, _experiencia_extraInitializers);
            __esDecorate(null, null, _especialidades_decorators, { kind: "field", name: "especialidades", static: false, private: false, access: { has: function (obj) { return "especialidades" in obj; }, get: function (obj) { return obj.especialidades; }, set: function (obj, value) { obj.especialidades = value; } }, metadata: _metadata }, _especialidades_initializers, _especialidades_extraInitializers);
            __esDecorate(null, null, _instagram_decorators, { kind: "field", name: "instagram", static: false, private: false, access: { has: function (obj) { return "instagram" in obj; }, get: function (obj) { return obj.instagram; }, set: function (obj, value) { obj.instagram = value; } }, metadata: _metadata }, _instagram_initializers, _instagram_extraInitializers);
            __esDecorate(null, null, _fotos_portafolio_decorators, { kind: "field", name: "fotos_portafolio", static: false, private: false, access: { has: function (obj) { return "fotos_portafolio" in obj; }, get: function (obj) { return obj.fotos_portafolio; }, set: function (obj, value) { obj.fotos_portafolio = value; } }, metadata: _metadata }, _fotos_portafolio_initializers, _fotos_portafolio_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePortaDto = CreatePortaDto;
