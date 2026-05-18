BEGIN;

DROP TABLE IF EXISTS entrega CASCADE;
DROP TABLE IF EXISTS bitacora CASCADE;
DROP TABLE IF EXISTS tarea CASCADE;
DROP TABLE IF EXISTS seguimiento_tutor CASCADE;
DROP TABLE IF EXISTS material CASCADE;
DROP TABLE IF EXISTS sesion CASCADE;
DROP TABLE IF EXISTS avance CASCADE;
DROP TABLE IF EXISTS asignacion CASCADE;
DROP TABLE IF EXISTS socio_formador CASCADE;
DROP TABLE IF EXISTS beneficiario CASCADE;
DROP TABLE IF EXISTS tutortec CASCADE;
DROP TABLE IF EXISTS usuario CASCADE;


CREATE TABLE usuario (
    id_usuario       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    correo           VARCHAR(150) NOT NULL UNIQUE,
    contrasena       VARCHAR(255) NOT NULL,
    rol              VARCHAR(50) NOT NULL,
    estatus          VARCHAR(50) NOT NULL,
    fecha_registro   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_usuario_rol
        CHECK (rol IN ('tutor', 'beneficiario', 'socio_formador', 'revisor'))
);


CREATE TABLE tutortec (
    id_tutor          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario        INTEGER NOT NULL UNIQUE,
    idioma            VARCHAR(50),
    horas_acumuladas  NUMERIC(8,2) NOT NULL DEFAULT 0,

    CONSTRAINT fk_tutortec_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_tutortec_horas
        CHECK (horas_acumuladas >= 0)
);

CREATE TABLE beneficiario (
    id_beneficiario  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario       INTEGER NOT NULL UNIQUE,
    matricula_folio  VARCHAR(50),
    nivel            VARCHAR(50),
    idioma           VARCHAR(50),

    CONSTRAINT fk_beneficiario_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


CREATE TABLE socio_formador (
    id_socio_formador INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario        INTEGER NOT NULL UNIQUE,
    cargo             VARCHAR(100),
    area              VARCHAR(100),

    CONSTRAINT fk_socio_formador_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE asignacion (
    id_asignacion   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tutor        INTEGER NOT NULL,
    id_beneficiario INTEGER NOT NULL,
    periodo         VARCHAR(50),
    fecha_inicio    DATE,
    fecha_fin       DATE,
    estatus         VARCHAR(50),

    CONSTRAINT fk_asignacion_tutor
        FOREIGN KEY (id_tutor)
        REFERENCES tutortec(id_tutor)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_asignacion_beneficiario
        FOREIGN KEY (id_beneficiario)
        REFERENCES beneficiario(id_beneficiario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_asignacion_fechas
        CHECK (fecha_fin IS NULL OR fecha_inicio IS NULL OR fecha_fin >= fecha_inicio),

    CONSTRAINT uq_asignacion_unica
        UNIQUE (id_tutor, id_beneficiario, periodo)
);

CREATE TABLE material (
    id_material                INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_asignacion              INTEGER,
    titulo                     VARCHAR(200),
    tema                       VARCHAR(100),
    nivel                      VARCHAR(50),
    descripcion                TEXT,

    archivo_nombre             VARCHAR(255),
    archivo_tipo               VARCHAR(120),
    archivo_tamano             INTEGER,
    archivo_datos              BYTEA,
    archivo_url                VARCHAR(255),

    nombre_archivo_original    VARCHAR(255),
    nombre_archivo_guardado    VARCHAR(255),
    ruta_archivo               TEXT,
    mime_type                  VARCHAR(150),
    tamano_bytes               INTEGER,

    fecha_subida               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_registro             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_material_asignacion
        FOREIGN KEY (id_asignacion)
        REFERENCES asignacion(id_asignacion)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE TABLE sesion (
    id_sesion          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_asignacion      INTEGER NOT NULL,
    fecha_sesion       DATE NOT NULL,
    hora_inicio        TIME,
    hora_fin           TIME,
    tema               VARCHAR(150),
    observaciones      TEXT,
    asistencia         VARCHAR(30),
    horas_registradas  NUMERIC(6,2) NOT NULL DEFAULT 0,

    CONSTRAINT fk_sesion_asignacion
        FOREIGN KEY (id_asignacion)
        REFERENCES asignacion(id_asignacion)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_sesion_horas_registradas
        CHECK (horas_registradas >= 0),

    CONSTRAINT chk_sesion_horario
        CHECK (hora_fin IS NULL OR hora_inicio IS NULL OR hora_fin >= hora_inicio)
);

CREATE TABLE bitacora (
    id_bitacora   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_sesion     INTEGER NOT NULL,
    fecha         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo          VARCHAR(50),
    descripcion   TEXT,
    archivo_url   VARCHAR(255),

    CONSTRAINT fk_bitacora_sesion
        FOREIGN KEY (id_sesion)
        REFERENCES sesion(id_sesion)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE TABLE avance (
    id_avance           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_beneficiario     INTEGER NOT NULL,
    score_diagnostico   INTEGER,
    nivel_diagnostico   VARCHAR(50),

    CONSTRAINT fk_avance_beneficiario
        FOREIGN KEY (id_beneficiario)
        REFERENCES beneficiario(id_beneficiario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_avance_score
        CHECK (score_diagnostico IS NULL OR score_diagnostico >= 0)
);

CREATE TABLE tarea (
    id_tarea           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_asignacion      INTEGER NOT NULL,
    titulo             VARCHAR(150) NOT NULL,
    descripcion        TEXT,
    fecha_asignacion   DATE,
    fecha_limite       DATE,
    archivo_apoyo      VARCHAR(255),
    estatus            VARCHAR(50),

    CONSTRAINT fk_tarea_asignacion
        FOREIGN KEY (id_asignacion)
        REFERENCES asignacion(id_asignacion)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_tarea_fechas
        CHECK (fecha_limite IS NULL OR fecha_asignacion IS NULL OR fecha_limite >= fecha_asignacion)
);

CREATE TABLE entrega (
    id_entrega            INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tarea              INTEGER NOT NULL,
    fecha_entrega         TIMESTAMP,
    archivo_entregado     VARCHAR(255),
    comentario_entrega    TEXT,
    calificacion          NUMERIC(5,2),
    retroalimentacion     TEXT,

    CONSTRAINT fk_entrega_tarea
        FOREIGN KEY (id_tarea)
        REFERENCES tarea(id_tarea)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_entrega_calificacion
        CHECK (calificacion IS NULL OR calificacion >= 0)
);

CREATE TABLE seguimiento_tutor (
    id_seguimiento   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tutor         INTEGER NOT NULL,
    observacion      TEXT NOT NULL,
    fecha_registro   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estatus          VARCHAR(30) NOT NULL DEFAULT 'registrado',

    CONSTRAINT fk_seguimiento_tutor
        FOREIGN KEY (id_tutor)
        REFERENCES tutortec(id_tutor)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


CREATE INDEX idx_tutortec_id_usuario         ON tutortec(id_usuario);
CREATE INDEX idx_beneficiario_id_usuario     ON beneficiario(id_usuario);
CREATE INDEX idx_socio_formador_id_usuario   ON socio_formador(id_usuario);
CREATE INDEX idx_asignacion_id_tutor         ON asignacion(id_tutor);
CREATE INDEX idx_asignacion_id_beneficiario  ON asignacion(id_beneficiario);
CREATE INDEX idx_material_id_asignacion      ON material(id_asignacion);
CREATE INDEX idx_sesion_id_asignacion        ON sesion(id_asignacion);
CREATE INDEX idx_bitacora_id_sesion          ON bitacora(id_sesion);
CREATE INDEX idx_avance_id_beneficiario      ON avance(id_beneficiario);
CREATE INDEX idx_tarea_id_asignacion         ON tarea(id_asignacion);
CREATE INDEX idx_entrega_id_tarea            ON entrega(id_tarea);
CREATE INDEX idx_seguimiento_id_tutor        ON seguimiento_tutor(id_tutor);


WITH nuevo_tutor AS (
    INSERT INTO usuario (
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        contrasena,
        rol,
        estatus
    )
    VALUES (
        'Tutor',
        'Prueba',
        'Talk',
        'tutor@talk.com',
        '$2a$12$nug2/tHzcOCOHwGLmm9/RudnXfahb1GYmjQfoIa8WCPnQRhayIz7.',
        'tutor',
        'activo'
    )
    RETURNING id_usuario
)
INSERT INTO tutortec (id_usuario, idioma, horas_acumuladas)
SELECT id_usuario, 'espanol', 0
FROM nuevo_tutor;

WITH nuevo_beneficiario AS (
    INSERT INTO usuario (
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        contrasena,
        rol,
        estatus
    )
    VALUES (
        'Beneficiario',
        'Prueba',
        'Talk',
        'beneficiario@talk.com',
        '$2a$12$jiqBFGF3.ryGGV4E5hbYL.asDHVdtJM7xN4piUI5aj.q3/5NPgeSW',
        'beneficiario',
        'activo'
    )
    RETURNING id_usuario
)
INSERT INTO beneficiario (id_usuario, matricula_folio, nivel, idioma)
SELECT id_usuario, 'MAT-0001', 'A1', 'espanol'
FROM nuevo_beneficiario;

WITH nuevo_socio_formador AS (
    INSERT INTO usuario (
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        contrasena,
        rol,
        estatus
    )
    VALUES (
        'Socio',
        'Formador',
        'Talk',
        'socio_formador@talk.com',
        '$2a$12$5uL20rWrwL6CGvv6b22v3eeWBR.9/XEDB7FHZj.mrWPSR/zNF7g66',
        'socio_formador',
        'activo'
    )
    RETURNING id_usuario
)
INSERT INTO socio_formador (id_usuario, cargo, area)
SELECT id_usuario, 'Coordinador', 'Vinculacion'
FROM nuevo_socio_formador;

INSERT INTO usuario (
    nombre,
    apellido_paterno,
    apellido_materno,
    correo,
    contrasena,
    rol,
    estatus
)
VALUES (
    'Revisor',
    'Prueba',
    'Talk',
    'revisor@talk.com',
    '$2a$12$x9iWO/XvleFX8WyDSPzJ2OJ9F344UH1bOv2uDAYqwP99mo.zn5H.2',
    'revisor',
    'activo'
);


INSERT INTO asignacion (
    id_tutor,
    id_beneficiario,
    periodo,
    fecha_inicio,
    fecha_fin,
    estatus
)
VALUES
(1, 1, '2026-A', CURRENT_DATE, CURRENT_DATE + INTERVAL '120 days', 'Activa');


INSERT INTO avance (
    id_beneficiario,
    score_diagnostico,
    nivel_diagnostico
)
VALUES
(1, 75, 'A1');


INSERT INTO seguimiento_tutor (
    id_tutor,
    observacion,
    estatus
)
VALUES
(1, 'Seguimiento inicial del tutor de prueba.', 'registrado');


INSERT INTO material (
    id_asignacion,
    titulo,
    tema,
    nivel,
    descripcion,
    archivo_nombre,
    archivo_tipo,
    archivo_tamano,
    archivo_url,
    nombre_archivo_original,
    nombre_archivo_guardado,
    ruta_archivo,
    mime_type,
    tamano_bytes
)
VALUES
(
    1,
    'Guía institucional de bienvenida',
    'Introducción',
    'A1',
    'Material de ejemplo para validar la carga y consulta de materiales.',
    'guia_bienvenida.pdf',
    'application/pdf',
    102400,
    '/uploads/materiales/guia_bienvenida.pdf',
    'guia_bienvenida.pdf',
    'guia_bienvenida.pdf',
    '/uploads/materiales/guia_bienvenida.pdf',
    'application/pdf',
    102400
);


INSERT INTO sesion (
    id_asignacion,
    fecha_sesion,
    hora_inicio,
    hora_fin,
    tema,
    observaciones,
    asistencia,
    horas_registradas
)
VALUES
(
    1,
    CURRENT_DATE,
    '10:00',
    '11:00',
    'Presentación del curso',
    'Sesión de ejemplo para pruebas iniciales.',
    'asistio',
    1.00
);


INSERT INTO bitacora (
    id_sesion,
    tipo,
    descripcion,
    archivo_url
)
VALUES
(
    1,
    'registro',
    'Bitácora inicial de la sesión de prueba.',
    NULL
);


INSERT INTO tarea (
    id_asignacion,
    titulo,
    descripcion,
    fecha_asignacion,
    fecha_limite,
    archivo_apoyo,
    estatus
)
VALUES
(
    1,
    'Actividad diagnóstica',
    'Realizar ejercicio básico de diagnóstico.',
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '7 days',
    '/uploads/tareas/actividad_diagnostica.pdf',
    'pendiente'
);


INSERT INTO entrega (
    id_tarea,
    fecha_entrega,
    archivo_entregado,
    comentario_entrega,
    calificacion,
    retroalimentacion
)
VALUES
(
    1,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
);

COMMIT;