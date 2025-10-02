--USAR PUERTO 5433 NO OLVIDAR!!!


-- ==========================
-- TABLA: Usuarios
-- ==========================
CREATE TABLE Usuarios (
    idUsuarios SERIAL PRIMARY KEY,
    Nombre VARCHAR(45) NOT NULL,
    Apellidos VARCHAR(45) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Genero VARCHAR(45),
    FechaNacimiento DATE,
    Contrasena VARCHAR(255) NOT NULL,
    Celular VARCHAR(15)
);

-- ==========================
-- TABLA: Rol
-- ==========================
CREATE TABLE Rol (
    idRol SERIAL PRIMARY KEY,
    Usuarios_idUsuarios INT NOT NULL,
    Rol VARCHAR(45) NOT NULL,
    CONSTRAINT fk_rol_usuario FOREIGN KEY (Usuarios_idUsuarios)
        REFERENCES Usuarios (idUsuarios)
        ON DELETE CASCADE
);

-- ==========================
-- TABLA: Lecciones
-- ==========================
CREATE TABLE Lecciones (
    idLecciones SERIAL PRIMARY KEY,
    NombreLeccion VARCHAR(100) NOT NULL
);

-- ==========================
-- TABLA: Notas
-- ==========================
CREATE TABLE Notas (
    idNotas SERIAL PRIMARY KEY,
    Puntuacion DECIMAL(5,2) NOT NULL,
    Usuarios_idUsuarios INT NOT NULL,
    Lecciones_idLecciones INT NOT NULL,
    CONSTRAINT fk_notas_usuario FOREIGN KEY (Usuarios_idUsuarios)
        REFERENCES Usuarios (idUsuarios)
        ON DELETE CASCADE,
    CONSTRAINT fk_notas_leccion FOREIGN KEY (Lecciones_idLecciones)
        REFERENCES Lecciones (idLecciones)
        ON DELETE CASCADE
);




select * from Notas

------------------------------


CREATE TABLE recuperacion (
    id SERIAL PRIMARY KEY,
    idusuario INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expira TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (idusuario) REFERENCES usuarios(idusuarios) ON DELETE CASCADE
);


select * from usuarios


----------------------------INSERCIONES----------------
-- ==========================
-- Insertar Usuarios
-- ==========================
INSERT INTO Usuarios (Nombre, Apellidos, Correo, Genero, FechaNacimiento, Contrasena, Celular)
VALUES
('Juan', 'Perez', 'juan.perez@example.com', 'Masculino', '1995-04-15', 'hash_pass_juan', '70123456'),
('Maria', 'Lopez', 'maria.lopez@example.com', 'Femenino', '1998-07-22', 'hash_pass_maria', '78965432'),
('Carlos', 'Gomez', 'carlos.gomez@example.com', 'Masculino', '2000-01-10', 'hash_pass_carlos', '71239876');

-- ==========================
-- Insertar Roles
-- ==========================
INSERT INTO Rol (Usuarios_idUsuarios, Rol)
VALUES
(1, 'Estudiante'),
(2, 'Estudiante'),
(3, 'Estudiante');


-- El mismo usuario puede tener diferentes roles
INSERT INTO Rol (Usuarios_idUsuarios, Rol)
VALUES
(2, 'Docente'),  -- Maria ahora es también docente
(3, 'Alumno');   -- Carlos ahora también es alumno
-- ==========================
-- Insertar Lecciones
-- ==========================
INSERT INTO Lecciones (NombreLeccion)
VALUES
('Saludos básicos'),
('Presentaciones'),
('Preguntas frecuentes'),
('Expresiones de cortesía'),
('Conversación avanzada');

-- ==========================
-- Insertar Notas
-- ==========================
INSERT INTO Notas (Puntuacion, Usuarios_idUsuarios, Lecciones_idLecciones)
VALUES
(85.50, 2, 1),  -- Maria en "Saludos básicos"
(90.20, 2, 2),  -- Maria en "Presentaciones"
(75.00, 3, 1),  -- Carlos en "Saludos básicos"
(60.75, 3, 3),  -- Carlos en "Preguntas frecuentes"
(95.00, 1, 4);  -- Juan en "Expresiones de cortesía"

-------------------
SELECT u.Nombre, u.Apellidos, l.NombreLeccion, n.Puntuacion
FROM Notas n
JOIN Usuarios u ON n.Usuarios_idUsuarios = u.idUsuarios
JOIN Lecciones l ON n.Lecciones_idLecciones = l.idLecciones
WHERE u.idUsuarios = 2;
---

-- Lecciones independientes
INSERT INTO Lecciones (NombreLeccion)
VALUES
('Vocabulario avanzado'),
('Conversación en contextos formales');

select * from Notas
-- Maria (id=2) toma nuevas lecciones
INSERT INTO Notas (Puntuacion, Usuarios_idUsuarios, Lecciones_idLecciones)
VALUES
(88.75, 2, 5),  -- Maria en "Conversación avanzada"
(70.40, 2, 6);  -- Maria en "Vocabulario avanzado"


-- ❌ Usuario con id=99 no existe
INSERT INTO Notas (Puntuacion, Usuarios_idUsuarios, Lecciones_idLecciones)
VALUES (50.00, 99, 1);
---
-- ❌ Lección con id=999 no existe
INSERT INTO Notas (Puntuacion, Usuarios_idUsuarios, Lecciones_idLecciones)
VALUES (65.00, 2, 999);
---
-- multiples roles
SELECT u.idUsuarios, u.Nombre, u.Apellidos, STRING_AGG(r.Rol, ', ') AS Roles
FROM Usuarios u
JOIN Rol r ON u.idUsuarios = r.Usuarios_idUsuarios
GROUP BY u.idUsuarios, u.Nombre, u.Apellidos
HAVING COUNT(r.idRol) > 1;

-- Lecciones
SELECT l.idLecciones, l.NombreLeccion
FROM Lecciones l
LEFT JOIN Notas n ON l.idLecciones = n.Lecciones_idLecciones
WHERE n.idNotas IS NULL;
-- alumnos sin notas
SELECT u.idUsuarios, u.Nombre, u.Apellidos
FROM Usuarios u
LEFT JOIN Notas n ON u.idUsuarios = n.Usuarios_idUsuarios
WHERE n.idNotas IS NULL;
-- notas de los alumnos
SELECT u.Nombre, u.Apellidos, l.NombreLeccion, n.Puntuacion
FROM Notas n
JOIN Usuarios u ON n.Usuarios_idUsuarios = u.idUsuarios
JOIN Lecciones l ON n.Lecciones_idLecciones = l.idLecciones
ORDER BY u.idUsuarios, l.idLecciones;
-- promedio de notas de alumno
SELECT u.Nombre, u.Apellidos, ROUND(AVG(n.Puntuacion), 2) AS Promedio
FROM Notas n
JOIN Usuarios u ON n.Usuarios_idUsuarios = u.idUsuarios
GROUP BY u.idUsuarios, u.Nombre, u.Apellidos
ORDER BY Promedio DESC;
 --promedio de notas por leccion
SELECT l.NombreLeccion, ROUND(AVG(n.Puntuacion), 2) AS Promedio
FROM Notas n
JOIN Lecciones l ON n.Lecciones_idLecciones = l.idLecciones
GROUP BY l.idLecciones, l.NombreLeccion
ORDER BY Promedio DESC;

-------- verifica recuperacion table

 select * from usuarios ;
select * from recuperacion
