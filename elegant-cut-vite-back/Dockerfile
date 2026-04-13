# 1. Usa un Linux super ligero con Node 20 instalado
FROM node:20-alpine

# Instala OpenSSL (requerido por Prisma en Alpine)
RUN apk add --no-cache openssl

# 2. Crea una carpeta adentro del Linux para guardar el proyecto
WORKDIR /usr/src/app

# 3. Copia primero las dependencias y la configuración de base de datos
COPY package*.json ./
COPY prisma ./prisma/

# 4. Instala todas las librerías de Node.js limpias
RUN npm install

# 5. Genera los archivos internos de Prisma para conectar a la BD
RUN npx prisma generate

# 6. Copia todo el resto de tu código fuente (src, etc)
COPY . .

# 7. Traduce tu código de TypeScript a JavaScript (crea la carpeta dist)
RUN npm run build

# 8. Declara que la aplicación se comunicará por el puerto 3000
EXPOSE 3001

# 9. Comando que encenderá el servidor backend cuando inicie Docker
CMD ["npm", "run", "start:prod"]
