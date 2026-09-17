# 🧪 Reporte de Pruebas Unitarias

> **Fecha de Ejecución:** 17/9/2026, 15:26:29
> **Duración Total:** 7.69s  
> **Estado:** ✅ **EXITOSO**

## 📊 Resumen Ejecutivo

| Métrica | Estado | Total |
| :--- | :--- | :--- |
| **Test Suites** | 9 passed | **9 total** |
| **Tests** | 60 passed | **60 total** |
| **Efectividad** | 100.0% | - |

## 📋 Detalle de Suites y Casos de Prueba

### 1. `barbers.service.spec.ts` — ✅ PASS

- **Archivo:** `test/pruebas unitarias/barbers.service.spec.ts`
- **Pruebas:** 6 exitosas / 6 totales
- **Duración:** 4.83s

| Estado | Contexto / Módulo | Caso de Prueba | Duración |
| :---: | :--- | :--- | :---: |
| ✅ | BarbersService - Pruebas Unitarias | El servicio de Barberos debe estar definido | 25ms |
| ✅ | BarbersService - Pruebas Unitarias › RF-023: Crear Barbero | Debe crear un barbero, encriptar su clave y vincular su portafolio | 8ms |
| ✅ | BarbersService - Pruebas Unitarias › RF-024: Listar Barberos | Debe listar todos los barberos registrados | 4ms |
| ✅ | BarbersService - Pruebas Unitarias › RF-025: Activar/Desactivar Barbero | Debe alternar (toggle) el estado de un barbero | 6ms |
| ✅ | BarbersService - Pruebas Unitarias › RF-025: Activar/Desactivar Barbero | Debe ocultar al barbero (desactivarlo suavemente) con el método remove | 5ms |
| ✅ | BarbersService - Pruebas Unitarias › mapBarberWithRating coverage | Debe calcular la calificacion promedio correctamente | 3ms |

### 2. `users.service.spec.ts` — ✅ PASS

- **Archivo:** `test/pruebas unitarias/users.service.spec.ts`
- **Pruebas:** 10 exitosas / 10 totales
- **Duración:** 4.86s

| Estado | Contexto / Módulo | Caso de Prueba | Duración |
| :---: | :--- | :--- | :---: |
| ✅ | UsersService - Pruebas Unitarias | El servicio de Usuarios debe estar definido | 41ms |
| ✅ | UsersService - Pruebas Unitarias › RF-014: Perfil de Usuario | Debe consultar la información básica del perfil del usuario (getUserBasicInfo) | 8ms |
| ✅ | UsersService - Pruebas Unitarias › RF-014: Perfil de Usuario | Debe actualizar los datos de perfil del cliente | 8ms |
| ✅ | UsersService - Pruebas Unitarias › RF-019: Crear Administrador | Debe crear un usuario con id_rol = 1 (Admin) exitosamente | 4ms |
| ✅ | UsersService - Pruebas Unitarias › RF-019: Crear Administrador | Debe rechazar la creación si el email ya existe | 27ms |
| ✅ | UsersService - Pruebas Unitarias › RF-020: Listar Administradores | Debe listar todos los usuarios con rol 1 | 4ms |
| ✅ | UsersService - Pruebas Unitarias › RF-020: Listar Administradores | Debe retornar un array vacío si ocurre un error | 4ms |
| ✅ | UsersService - Pruebas Unitarias › RF-021: Editar Administrador | Debe actualizar los datos de un administrador | 10ms |
| ✅ | UsersService - Pruebas Unitarias › RF-021: Editar Administrador | Debe encriptar la contraseña si se envía en la edición | 4ms |
| ✅ | UsersService - Pruebas Unitarias › RF-022: Activar/Desactivar Administrador | Debe desactivar (borrado suave) un administrador cambiando su estado a false | 4ms |

### 3. `email.service.spec.ts` — ✅ PASS

- **Archivo:** `test/pruebas unitarias/email.service.spec.ts`
- **Pruebas:** 3 exitosas / 3 totales
- **Duración:** 5.12s

| Estado | Contexto / Módulo | Caso de Prueba | Duración |
| :---: | :--- | :--- | :---: |
| ✅ | EmailService - Pruebas Unitarias | El servicio de Email debe estar definido | 24ms |
| ✅ | EmailService - Pruebas Unitarias › RF-015: Notificaciones por Email | Debe enviar correctamente un correo de verificación | 8ms |
| ✅ | EmailService - Pruebas Unitarias › RF-015: Notificaciones por Email | Debe enviar correctamente un correo de confirmación de PQRS | 32ms |

### 4. `uploads.service.spec.ts` — ✅ PASS

- **Archivo:** `test/pruebas unitarias/uploads.service.spec.ts`
- **Pruebas:** 3 exitosas / 3 totales
- **Duración:** 5.28s

| Estado | Contexto / Módulo | Caso de Prueba | Duración |
| :---: | :--- | :--- | :---: |
| ✅ | UploadsService | should reject with Error when cloudinary upload fails | 54ms |
| ✅ | UploadsService | should reject with fallback Error message when cloudinary upload fails without message | 5ms |
| ✅ | UploadsService | should resolve result when upload succeeds | 5ms |

### 5. `dashboard.service.spec.ts` — ✅ PASS

- **Archivo:** `test/pruebas unitarias/dashboard.service.spec.ts`
- **Pruebas:** 5 exitosas / 5 totales
- **Duración:** 5.28s

| Estado | Contexto / Módulo | Caso de Prueba | Duración |
| :---: | :--- | :--- | :---: |
| ✅ | DashboardService - Pruebas Unitarias | El servicio de dashboard debe estar definido | 30ms |
| ✅ | DashboardService - Pruebas Unitarias › Generación de Estadísticas (RF-011) | Debe devolver el resumen de estadísticas correctamente | 25ms |
| ✅ | DashboardService - Pruebas Unitarias › Generación de Estadísticas (RF-011) | Debe devolver la actividad reciente de citas | 7ms |
| ✅ | DashboardService - Pruebas Unitarias › Generación de Reporte PDF (RF-011) | Debe generar un buffer de PDF con las estadísticas y actividad actuales | 87ms |
| ✅ | DashboardService - Pruebas Unitarias › Generación de Reporte PDF (RF-011) | Debe manejar arreglos vacíos o nulos sin fallar durante la generación del PDF | 29ms |

### 6. `app.controller.spec.ts` — ✅ PASS

- **Archivo:** `test/pruebas unitarias/app.controller.spec.ts`
- **Pruebas:** 1 exitosas / 1 totales
- **Duración:** 0.43s

| Estado | Contexto / Módulo | Caso de Prueba | Duración |
| :---: | :--- | :--- | :---: |
| ✅ | AppController › root | should return "Hello World!" | 7ms |

### 7. `portabarbero.service.spec.ts` — ✅ PASS

- **Archivo:** `test/pruebas unitarias/portabarbero.service.spec.ts`
- **Pruebas:** 4 exitosas / 4 totales
- **Duración:** 0.48s

| Estado | Contexto / Módulo | Caso de Prueba | Duración |
| :---: | :--- | :--- | :---: |
| ✅ | PortabarberoService - Pruebas Unitarias | should be defined | 8ms |
| ✅ | PortabarberoService - Pruebas Unitarias › RF-017: Portafolio de Barbero | Debe consultar el portafolio por ID de usuario/barbero | 3ms |
| ✅ | PortabarberoService - Pruebas Unitarias › RF-017: Portafolio de Barbero | Debe crear un portafolio serializando especialidades y fotos a JSON | 3ms |
| ✅ | PortabarberoService - Pruebas Unitarias › RF-017: Portafolio de Barbero | Debe eliminar un portafolio si existe | 2ms |

### 8. `pqrs.service.spec.ts` — ✅ PASS

- **Archivo:** `test/pruebas unitarias/pqrs.service.spec.ts`
- **Pruebas:** 7 exitosas / 7 totales
- **Duración:** 6.12s

| Estado | Contexto / Módulo | Caso de Prueba | Duración |
| :---: | :--- | :--- | :---: |
| ✅ | PqrsService - Pruebas Unitarias | El servicio de PQRS debe estar definido | 19ms |
| ✅ | PqrsService - Pruebas Unitarias › Creación de PQRS (RF-009) | Debe crear una PQRS, generar un radicado y enviar correo de confirmación | 5ms |
| ✅ | PqrsService - Pruebas Unitarias › Consulta de PQRS (RF-016) | Debe buscar PQRS por correo electrónico del usuario | 3ms |
| ✅ | PqrsService - Pruebas Unitarias › Consulta de PQRS (RF-016) | Debe extraer el ID del radicado y buscarlo correctamente | 6ms |
| ✅ | PqrsService - Pruebas Unitarias › Consulta de PQRS (RF-016) | Debe arrojar error si el radicado tiene formato inválido | 17ms |
| ✅ | PqrsService - Pruebas Unitarias › Administración de PQRS | Debe retornar NotFoundException si la PQRS no existe | 2ms |
| ✅ | PqrsService - Pruebas Unitarias › Administración de PQRS | Debe actualizar el estado de una PQRS existente | 2ms |

### 9. `auth.service.spec.ts` — ✅ PASS

- **Archivo:** `test/pruebas unitarias/auth.service.spec.ts`
- **Pruebas:** 21 exitosas / 21 totales
- **Duración:** 6.23s

| Estado | Contexto / Módulo | Caso de Prueba | Duración |
| :---: | :--- | :--- | :---: |
| ✅ | AuthService - Pruebas Unitarias Iniciales | el servicio de autenticacion debe estar definido | 15ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación y Registro (RF-001) | Debe arrojar "Contraseña incorrecta" si la contraseña no coincide | 32ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación y Registro (RF-001) | Debe iniciar sesión exitosamente y devolver un token si los datos son correctos | 3ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación y Registro (RF-001) | Debe rechazar el registro si el nombre contiene caracteres especiales y números (112, @, $, #) | 7ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Recuperación de Contraseña (RF-002) | Debe arrojar error al solicitar recuperación si email no está registrado | 5ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Recuperación de Contraseña (RF-002) | Debe enviar código de recuperación correctamente | 3ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Recuperación de Contraseña (RF-002) | Debe manejar excepción de findByEmail en solicitarRecuperacion | 2ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Recuperación de Contraseña (RF-002) | Debe resetear la contraseña correctamente | 89ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe iniciar sesión con Google exitosamente | 2ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe fallar si payload de Google es nulo | 2ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe crear usuario al iniciar sesión con Google si no existe | 2ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe crear usuario al iniciar sesión con Google con nombres proporcionados | 1ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe crear usuario al iniciar sesión con Google si no existe y no hay email | 1ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe vincular cuenta si google_id falta al iniciar sesión con Google | 2ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe iniciar sesión con Google Server Side exitosamente | 1ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe lanzar error si reqUser es nulo en googleLoginServerSide | 3ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe crear usuario al iniciar sesión con Google Server Side si no existe | 1ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe crear usuario al iniciar sesión con Google Server Side con nombres | 2ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe crear usuario al iniciar sesión con Google Server Side si no existe y falta email | 1ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe iniciar sesión con Google Server Side exitosamente cuando ya tiene google_id | 3ms |
| ✅ | AuthService - Pruebas Unitarias Iniciales › Autenticación con Google (RF-013) | Debe lanzar UnauthorizedException si googleClient falla | 1ms |

---
*Reporte generado automáticamente por Jest Reporter para Elegant Cut.*
