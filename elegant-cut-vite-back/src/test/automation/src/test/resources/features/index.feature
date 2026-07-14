# language: es
Característica: Verificar la pagina principal del sistema ElegantCut

  Escenario: Despues de iniciar sesion el usuario ve la pagina principal
    Dado que el usuario esta en la pagina de login
    Cuando el usuario ingresa sus credenciales validas
    Entonces deberia ver la pagina de inicio index
