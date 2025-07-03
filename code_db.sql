USE gestion_bienes;

use gestion_bienes;

CREATE TABLE rol ( id_rol  INT AUTO_INCREMENT PRIMARY KEY, 
	name_rol VARCHAR(50)
);

		-- Migrar los datos de 'db_activos' a la versdión 2 'gestion_bienes'
		-- Desactivar temporalmente las comprobaciones de FK
		SET FOREIGN_KEY_CHECKS = 0;
		INSERT INTO gestion_bienes.rol (id_rol, name_rol) SELECT id_rol, name_rol FROM db_activos.rol;
		-- Volver a activar las comprobaciones de FK
		SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE admin (
	id BIGINT PRIMARY KEY COMMENT 'Número de Documento', 
	name_admin VARCHAR(200) ,
	email VARCHAR (200) COMMENT 'Alias del Correo FLA',
	password VARCHAR (150),
	id_rol INT COMMENT 'Rol Administrativo',
	FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
) COMMENT = 'Tabla de Administrador de Bienes' ;

		-- Migrar los datos de 'db_activos' a la versdión 2 'gestion_bienes'
		-- Desactivar temporalmente las comprobaciones de FK
		SET FOREIGN_KEY_CHECKS = 0;
		INSERT INTO gestion_bienes.admin ( id, name_admin, email, password, id_rol
		) SELECT id, name_admin, email, password, id_rol FROM db_activos.admin;
		-- Volver a activar las comprobaciones de FK
		SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE charge ( id_charge INT AUTO_INCREMENT PRIMARY KEY, 
	name_charge VARCHAR(200)
);

		-- Migrar los datos de 'db_activos' a la versdión 2 'gestion_bienes'
		-- Desactivar temporalmente las comprobaciones de FK
		SET FOREIGN_KEY_CHECKS = 0;
		INSERT INTO gestion_bienes.charge ( id_charge, name_charge) SELECT id_charge, name_charge FROM db_activos.charge;
		SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE subgerence (id_sub INT AUTO_INCREMENT PRIMARY KEY,
	name_sub VARCHAR(200)
);

		-- Migrar los datos de 'db_activos' a la versdión 2 'gestion_bienes'
		-- Desactivar temporalmente las comprobaciones de FK
		SET FOREIGN_KEY_CHECKS = 0;
		INSERT INTO gestion_bienes.subgerence (id_sub, name_sub ) SELECT id_sub, name_sub FROM db_activos.subgerence;
		SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE dependency ( id_depen INT AUTO_INCREMENT PRIMARY KEY,
	name_depen VARCHAR (200),
    id_sub INT,
    FOREIGN KEY (id_sub) REFERENCES subgerence(id_sub)
);

		-- Migrar los datos de 'db_activos' a la versdión 2 'gestion_bienes'
		-- Desactivar temporalmente las comprobaciones de FK
		SET FOREIGN_KEY_CHECKS = 0;
		INSERT INTO gestion_bienes.dependency (id_depen, name_depen, id_sub) SELECT id_depen, name_depen, id_sub FROM db_activos.dependency;
		SET FOREIGN_KEY_CHECKS = 1;
        
CREATE TABLE status (
    id_status INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name_status VARCHAR(100)
);


CREATE TABLE position ( 
	id_pos BIGINT PRIMARY KEY COMMENT 'Número de Documento',
	name VARCHAR(200),
    email VARCHAR (200),
    id_charge INT,
    id_sub INT,
    id_depen INT,
	id_status INT,
    FOREIGN KEY (id_charge) REFERENCES charge (id_charge),
    FOREIGN KEY (id_sub) REFERENCES subgerence(id_sub),
    FOREIGN KEY (id_depen) REFERENCES dependency (id_depen),
    FOREIGN KEY (id_status) REFERENCES status (id_status)
);

use gestion_bienes;

ALTER TABLE position ADD COLUMN estado ENUM('Activo', 'Inactivo'); 

		-- Migrar los datos de 'db_activos' a la versdión 2 'gestion_bienes'
		-- Desactivar temporalmente las comprobaciones de FK
		SET FOREIGN_KEY_CHECKS = 0;
		INSERT INTO gestion_bienes.position ( id_pos, name, email, id_charge, id_sub, id_depen
		) SELECT id_posi, name, email, id_charge, id_sub, id_depen FROM db_activos.position;
		-- Volver a activar las comprobaciones de FK
		SET FOREIGN_KEY_CHECKS = 1;
        
        -- 1) Para forzar 1 en todos los registros:
-- 1) Para forzar 1 en todos los registros:
UPDATE position
SET id_status = 1;

SET SQL_SAFE_UPDATES = 0;
UPDATE `position`
SET id_status = 1 WHERE id_pos IS NOT NULL;
SET SQL_SAFE_UPDATES = 1;



-- 2) (Opcional) Si solo quieres actualizar los que aún no tengan valor:
ALTER TABLE position
ALTER COLUMN id_status SET DEFAULT 1;

    
		-- Migrar los datos de 'db_activos' a la versdión 2 'gestion_bienes'
		-- Desactivar temporalmente las comprobaciones de FK
		SET FOREIGN_KEY_CHECKS = 0;
		INSERT INTO gestion_bienes.tags (id_tag, TagType) SELECT id_tag, TagType FROM db_activos.tag;
		SET FOREIGN_KEY_CHECKS = 1;
    
CREATE TABLE contract (
	id_contra VARCHAR(50) PRIMARY KEY NOT NULL COMMENT 'Número de contrato.',
    price BIGINT,
    date_contra TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    provider VARCHAR(200)
);

CREATE TABLE item ( 
	tag VARCHAR(50)  PRIMARY KEY COMMENT 'Placa de cada activo.',
	name_item VARCHAR(200),
    brand VARCHAR(200),
    serialNumber VARCHAR(200),
    id_contra VARCHAR(50),
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    img VARCHAR (200),
    id_tag INT,
	id_status INT,
    FOREIGN KEY (id_tag) REFERENCES tags (id_tag),
    FOREIGN KEY (id_contra) REFERENCES contract (id_contra),
    FOREIGN KEY (id_status) REFERENCES status (id_status)
);

		-- Migrar los datos de 'db_activos' a la versdión 2 'gestion_bienes'
		-- Desactivar temporalmente las comprobaciones de FK
		SET FOREIGN_KEY_CHECKS = 0;
		INSERT INTO gestion_bienes.item ( tag, name_item, brand, serialNumber, id_contra, img, id_tag
        ) SELECT tag, name_item, brand, serialNumber, id_contra, img, id_tag FROM db_activos.item;
		SET FOREIGN_KEY_CHECKS = 1;
    
CREATE TABLE assign (
	id_assi INT AUTO_INCREMENT PRIMARY KEY,
    date_assi  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TINYTEXT,
    location VARCHAR(200),
    img VARCHAR (200),
    id_pos INT,
    tag VARCHAR(50),
    FOREIGN KEY (tag) REFERENCES item (tag),
    FOREIGN KEY (id_pos) REFERENCES position (id_pos)
);

		-- Migrar los datos de 'db_activos.transfer' a la versdión 2 'gestion_bienes.assign'
		-- Desactivar temporalmente las comprobaciones de FK
        SET FOREIGN_KEY_CHECKS = 0;
		INSERT INTO gestion_bienes.assign ( id_assi, date_assi, details, location, img, id_pos, tag
        ) SELECT id_transfer, fecha_traslado, details, location, img, id_posi, tag FROM db_activos.transfer;
		SET FOREIGN_KEY_CHECKS = 1;
        
        -- Historial
        CREATE TABLE historial_assign (
			id_histo INT AUTO_INCREMENT PRIMARY KEY,
            date_assi date,
            date_devo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            tag VARCHAR(200),
            id_pos INT,
            id_assi INT,	
            FOREIGN KEY (tag) REFERENCES item (tag),
            FOREIGN KEY (id_pos) REFERENCES position (id_pos),
            FOREIGN KEY (id_assi) REFERENCES assign (id_assi)
        );

CREATE TABLE transfer (
	id_transfer INT AUTO_INCREMENT PRIMARY KEY,
    details TINYTEXT,
    location VARCHAR(200),
    date_transfer TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_pos INT,
    id_assi INT,
    FOREIGN KEY (id_pos) REFERENCES position (id_pos),
    FOREIGN KEY (id_assi) REFERENCES assign (id_assi)
);

-- Historial
CREATE TABLE historial_transfer (
	id_his INT AUTO_INCREMENT PRIMARY KEY,
    details VARCHAR(200),
    new_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_transfer INT,
    FOREIGN KEY (id_transfer) REFERENCES transfer (id_transfer)
);

CREATE TABLE devolution (
	id_devo INT AUTO_INCREMENT PRIMARY KEY,
    date_devo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details TINYTEXT,
    id_assi INT,
    FOREIGN KEY (id_assi) REFERENCES assign (id_assi)
);

CREATE TABLE actas (
	id_acta INT AUTO_INCREMENT PRIMARY KEY,
    id_assi INT,
    id_transfer INT,
    id_devo INT,
    FOREIGN KEY (id_assi) REFERENCES assign (id_assi),
    FOREIGN KEY (id_transfer) REFERENCES transfer(id_transfer),
    FOREIGN KEY (id_devo) REFERENCES devolution (id_devo)
);








