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
    Celular VARCHAR(15),
    idRol INT,  -- Nueva columna para la relación uno a muchos
    CONSTRAINT fk_usuario_rol FOREIGN KEY (idRol)
        REFERENCES Rol (idRol)  -- Referencia a la tabla Rol
        ON DELETE SET NULL  -- O ON DELETE CASCADE, dependiendo de tu lógica
);

-- ==========================
-- TABLA: Rol
-- ==========================
CREATE TABLE Rol (
    idRol SERIAL PRIMARY KEY,
    NombreRol VARCHAR(45) NOT NULL  -- Ahora es un rol independiente, como "Admin" o "Usuario"
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

-- ==========================
-- TABLA: Recuperacion
-- ==========================
CREATE TABLE recuperacion (
    id SERIAL PRIMARY KEY,
    idusuario INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expira TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (idusuario) REFERENCES usuarios(idusuarios) ON DELETE CASCADE
);