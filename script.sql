
CREATE TABLE competencia (
    id int AUTO_INCREMENT,
    nombre varchar(100),
    PRIMARY KEY (id)    
);

INSERT INTO competencia (nombre) VALUES 
    ('¿Cual es tu pelicula favorita?'),
    ('¿Cual es la mas aburrida?'),
    ('¿Cual tiene los mejores efectos especiales?'),
    ('¿Que pelicula te gusto mas?'),
    ('¿Cual tiene el mejor guion?')

CREATE TABLE voto (
    id int AUTO_INCREMENT,
    competencia_id int,
    pelicula_id int unsigned,
    PRIMARY KEY (id),
    FOREIGN KEY (competencia_id) REFERENCES competencia(id),
    FOREIGN KEY (pelicula_id) REFERENCES pelicula(id)
);
