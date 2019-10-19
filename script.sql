
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

ALTER TABLE competencia ADD COLUMN genero_id int unsigned;
ALTER TABLE competencia ADD FOREIGN KEY (genero_id) REFERENCES genero(id);

ALTER TABLE competencia ADD COLUMN director_id int unsigned;
ALTER TABLE competencia ADD FOREIGN KEY (director_id) REFERENCES director(id);

ALTER TABLE competencia ADD COLUMN actor_id int unsigned;
ALTER TABLE competencia ADD FOREIGN KEY (actor_id) REFERENCES actor(id);