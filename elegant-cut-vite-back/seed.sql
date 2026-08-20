-- Insertar Roles
INSERT INTO rol (id_rol, nombre_rol) VALUES 
(1, 'Administrador'),
(2, 'Cliente'),
(3, 'Barbero')
ON DUPLICATE KEY UPDATE nombre_rol = VALUES(nombre_rol);

-- Insertar Usuario Admin (password: Admin123!)
-- Hash bcryptjs de 'Admin123!'
INSERT INTO usuarios (username, prim_nombre, seg_nombre, apellido1, apellido2, email, password_hash, telefono, estado, id_rol)
VALUES ('admin', 'Super', NULL, 'Admin', NULL, 'admin@elegantcut.com', '$2a$10$8KzaNdKIMyOkASCakLboD.1bQPVDCYCGPoSYjrtIjMua0MY/tOKp6', '3001234567', 1, 1)
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- Insertar Barberos (password: Barbero123!)
INSERT INTO usuarios (username, prim_nombre, seg_nombre, apellido1, apellido2, email, password_hash, telefono, estado, id_rol)
VALUES 
('carlos_barbero', 'Carlos', 'Andrés', 'Martínez', 'López', 'carlos@elegantcut.com', '$2a$10$8KzaNdKIMyOkASCakLboD.1bQPVDCYCGPoSYjrtIjMua0MY/tOKp6', '3109876543', 1, 3),
('miguel_barbero', 'Miguel', 'Ángel', 'Rodríguez', 'Gómez', 'miguel@elegantcut.com', '$2a$10$8KzaNdKIMyOkASCakLboD.1bQPVDCYCGPoSYjrtIjMua0MY/tOKp6', '3201234567', 1, 3),
('juan_barbero', 'Juan', 'Pablo', 'García', 'Torres', 'juan@elegantcut.com', '$2a$10$8KzaNdKIMyOkASCakLboD.1bQPVDCYCGPoSYjrtIjMua0MY/tOKp6', '3157654321', 1, 3)
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- Insertar Clientes (password: Cliente123!)
INSERT INTO usuarios (username, prim_nombre, seg_nombre, apellido1, apellido2, email, password_hash, telefono, estado, id_rol)
VALUES 
('pedro_cliente', 'Pedro', NULL, 'Sánchez', 'Ruiz', 'pedro@email.com', '$2a$10$8KzaNdKIMyOkASCakLboD.1bQPVDCYCGPoSYjrtIjMua0MY/tOKp6', '3001112233', 1, 2),
('maria_cliente', 'María', 'Fernanda', 'López', 'Castro', 'maria@email.com', '$2a$10$8KzaNdKIMyOkASCakLboD.1bQPVDCYCGPoSYjrtIjMua0MY/tOKp6', '3004445566', 1, 2)
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- Insertar portafolios para barberos
INSERT INTO portafolios (id_usuario, biografia, experiencia, especialidades, calificacion)
SELECT u.id_usuario, 
  CASE u.username
    WHEN 'carlos_barbero' THEN 'Barbero profesional con pasión por los cortes clásicos y modernos'
    WHEN 'miguel_barbero' THEN 'Especialista en degradados y diseños artísticos'
    WHEN 'juan_barbero' THEN 'Experto en barbería tradicional y cuidado de barba'
  END,
  CASE u.username
    WHEN 'carlos_barbero' THEN '5 años'
    WHEN 'miguel_barbero' THEN '3 años'
    WHEN 'juan_barbero' THEN '7 años'
  END,
  CASE u.username
    WHEN 'carlos_barbero' THEN 'Cortes clásicos, Fade, Pompadour'
    WHEN 'miguel_barbero' THEN 'Degradados, Diseños, Colorimetría'
    WHEN 'juan_barbero' THEN 'Barba, Afeitado clásico, Corte tijera'
  END,
  CASE u.username
    WHEN 'carlos_barbero' THEN 4.8
    WHEN 'miguel_barbero' THEN 4.5
    WHEN 'juan_barbero' THEN 4.9
  END
FROM usuarios u
WHERE u.username IN ('carlos_barbero', 'miguel_barbero', 'juan_barbero')
AND NOT EXISTS (SELECT 1 FROM portafolios p WHERE p.id_usuario = u.id_usuario);
