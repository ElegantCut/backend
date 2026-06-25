# language: es

Característica: Inicio de sesión ElegantCut

  Escenario: Inicio de sesión exitoso con credenciales válidas
    Dado el usuario abre la aplicación
    Cuando ingresa el usuario "pal" y la contraseña "123456"
    Entonces el debería ver la pantalla principal del sistema