"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var app_module_1 = require("./app.module");
var cookieParser = require("cookie-parser");
var http_exception_filter_1 = require("./common/filters/http-exception.filter");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app, cookieHandler, config, document, customJs, port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    cookieHandler = cookieParser.default || cookieParser;
                    app.use(typeof cookieHandler === 'function'
                        ? cookieHandler()
                        : cookieParser());
                    app.setGlobalPrefix('api');
                    // 2. Tuberías de validación (¡Esto está perfecto!)
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        whitelist: true,
                        transform: true,
                        forbidNonWhitelisted: true,
                    }));
                    // 2.5 Filtro de excepciones global para que todos los errores tengan el mismo formato
                    app.useGlobalFilters(new http_exception_filter_1.AllExceptionsFilter());
                    // 3. Habilitar CORS para conectar con Vite (Configuración robusta para cookies)
                    app.enableCors({
                        origin: true, // Permite cualquier origen que realice la petición
                        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
                        credentials: true,
                        allowedHeaders: [
                            'Content-Type',
                            'Accept',
                            'Authorization',
                            'X-Requested-With',
                        ],
                    });
                    config = new swagger_1.DocumentBuilder()
                        .setTitle('Elegant Cut API')
                        .setDescription('Documentación de la API de Elegant Cut, para reservación de barberías.')
                        .setVersion('1.0')
                        .addBearerAuth({
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                        name: 'JWT',
                        description: 'Ingresa tu token JWT',
                        in: 'header',
                    }, 'bearer') // Nombre del esquema: 'bearer'
                        .build();
                    document = swagger_1.SwaggerModule.createDocument(app, config);
                    customJs = "\n    (function() {\n      const originalFetch = window.fetch;\n      window.fetch = async (...args) => {\n        const response = await originalFetch(...args);\n        const url = args[0];\n        \n        // Si es la ruta de login y la respuesta es exitosa\n        if (typeof url === 'string' && url.includes('/auth/login') && response.ok) {\n          const clone = response.clone();\n          const body = await clone.json();\n          \n          if (body.token) {\n            // Estructura que usa Swagger UI para persistir la autorizaci\u00F3n\n            const authData = {\n              \"bearer\": {\n                \"name\": \"bearer\",\n                \"schema\": {\n                  \"type\": \"http\",\n                  \"scheme\": \"bearer\",\n                  \"bearerFormat\": \"JWT\",\n                  \"in\": \"header\"\n                },\n                \"value\": body.token\n              }\n            };\n            // Guardamos en localStorage para que Swagger lo reconozca\n            localStorage.setItem('swagger-js-ui-authorized', JSON.stringify(authData));\n            \n            // Opcional: Recargar para que Swagger aplique el cambio visualmente\n            console.log('\u2705 Token auto-guardado en Swagger');\n            setTimeout(() => {\n              window.location.reload(); \n            }, 500);\n          }\n        }\n        return response;\n      };\n    })();\n  ";
                    swagger_1.SwaggerModule.setup('api/docs', app, document, {
                        swaggerOptions: {
                            persistAuthorization: true,
                        },
                        customJsStr: customJs,
                    });
                    port = process.env.PORT || 3001;
                    return [4 /*yield*/, app.listen(port, '0.0.0.0')];
                case 2:
                    _a.sent();
                    console.log("\n Servidor corriendo en: http://localhost:".concat(port, "/api"));
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();
