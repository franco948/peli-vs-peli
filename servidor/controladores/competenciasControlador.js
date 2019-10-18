
//se importa una referencia a la conexión.
var con = require('../lib/conexionbd');

var competenciasControlador = {
    obtenerCompetencias: function (req, res) 
    {
        var sql = "SELECT * FROM competencia";
    
        //se ejecuta la consulta
        con.query(sql, function(error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }
    
            //si no hubo error, se crea el objeto respuesta con las canciones encontradas
            // var respuesta = {
            //     'canciones': resultado
            // };

            //se envía la respuesta
            // res.send(JSON.stringify(respuesta));
            res.json(resultado);
        });
    },
    
    obtenerOpciones: function(req, res)
    {
        var competenciaId = req.params.id;
        var sqlPeliculas = 
            "SELECT pelicula.id, pelicula.poster, pelicula.titulo FROM pelicula " +
            "JOIN director ON director.nombre = pelicula.director " +
            "WHERE (genero_id = ? OR ? IS null) AND (director.id = ? OR ? IS null) " +
            "ORDER BY rand() LIMIT 2";

        var sqlCompetencia = "SELECT * FROM competencia WHERE id = ?";
        var generoId = null;
        var directorId = null;

        //se ejecuta la consulta
        con.query(sqlCompetencia, [competenciaId], function(error, competencias, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }

            if (competencias.length === 0) {
                console.log("No se encontro ninguna competencia con ese id");
                return res.status(404).send("No se encontro ninguna competencia con ese id");
            }

            generoId = competencias[0].genero_id;
            directorId = competencias[0].director_id;

            console.log(competencias);

            var parametros = [generoId, generoId, directorId, directorId];

            con.query(sqlPeliculas, parametros, function(error, peliculas, fields) {
                //si hubo un error, se informa y se envía un mensaje de error
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(500).send("Hubo un error en la consulta");
                }               

                console.log(peliculas);

                //si no hubo error, se crea el objeto respuesta con las canciones encontradas
                var respuesta = {
                    'competencia': competencias[0].nombre,
                    'peliculas': peliculas
                };
    
                //se envía la respuesta
                res.json(respuesta);
            });
        });
    },

    votar: function(req, res) {

        var idCompetencia = req.params.id;
        var idPelicula = req.body.idPelicula;

        var sqlCompetencia = "select * from competencia where id = ?";
        var sqlPelicula = "select * from pelicula where id = ?";
        var sqlVoto = "INSERT INTO voto (competencia_id, pelicula_id) VALUES (?, ?)";
        
        con.query(sqlCompetencia, [idCompetencia], function(error, competencias, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }
            if (competencias.length == 0) {
                console.log("No se encontro ninguna competencia con ese id");
                return res.status(404).send("No se encontro ninguna competencia con ese id");
            } 

            con.query(sqlPelicula, [idPelicula], function(error, peliculas, fields) {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(500).send("Hubo un error en la consulta");
                }
                if (peliculas.length == 0) {
                    console.log("No se encontro ninguna película con ese id");
                    return res.status(404).send("No se encontro ninguna película con ese id");
                } 
    
                con.query(sqlVoto, [idCompetencia, idPelicula], function(error, resultado, fields) {
                    if (error) {
                        console.log("Hubo un error en la consulta", error.message);
                        return res.status(500).send("Hubo un error en la consulta");
                    }
                    // if (peliculas.length == 0) {
                    //     console.log("No se encontro ninguna película con ese id");
                    //     return res.status(404).send("No se encontro ninguna película con ese id");
                    // } 
                    
                    res.json('Voto realizado con exito!');
                });
            });
        });
    },

    obtenerResultados: function(req, res)
    {
        var idCompetencia = req.params.id;

        
        // var sql = "select * from usuario where id = " + id;
        var sqlCompetencia = "SELECT * FROM competencia WHERE id = ?"
        var sqlResultados = 
            "SELECT pelicula_id, poster, titulo, COUNT(*) as votos from voto " +
            "JOIN pelicula ON pelicula_id = pelicula.id " +
            "WHERE competencia_id = ? " +
            "GROUP BY pelicula_id " +
            "ORDER BY COUNT(*) DESC LIMIT 3";

        con.query(sqlCompetencia, [idCompetencia], function(error, competencias, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }
            if (competencias.length == 0) {
                console.log("No se encontro ninguna competencia con ese id");
                return res.status(404).send("No se encontro ninguna competencia con ese id");
            } 

            con.query(sqlResultados, [idCompetencia], function(error, resultados, fields) {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(500).send("Hubo un error en la consulta");
                }
                // if (resultados.length == 0) {
                //     console.log("No se encontro ningún nombre con ese id");
                //     return res.status(404).send("No se encontro ningún nombre con ese id");
                // } else {
                
                var response = {
                    'competencia': competencias[0].nombre,
                    'resultados': resultados
                };
    
                res.send(JSON.stringify(response));
            });
        });
    },

    agregarCompetencia: function(req, res)
    {
        var nombre = req.body.nombre;
        var generoId = req.body.genero;
        var directorId = req.body.director;

        if (generoId == 0)
        {
            generoId = null;
        }

        if (directorId == 0)
        {
            directorId = null;
        }

        var sqlValidarNombre = "SELECT * FROM competencia WHERE LOWER(nombre) = LOWER(?)";
        var sqlAgregarCompetencia = "INSERT INTO competencia (nombre, genero_id, director_id) VALUES (?,?,?)";
        var sqlPeliculas = 
            "SELECT pelicula.id, pelicula.poster, pelicula.titulo FROM pelicula " +
            "JOIN director ON director.nombre = pelicula.director " +
            "WHERE (genero_id = ? OR ? IS null) AND (director.id = ? OR ? IS null) " +
            "ORDER BY rand() LIMIT 2";

        con.query(sqlValidarNombre, [nombre], function(error, competencias, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }

            if (competencias.length != 0)
            {
                console.log("Ya existe una competencia con este nombre");
                return res.status(422).send("Ya existe una competencia con este nombre");
            }

            var parametros = [generoId, generoId, directorId, directorId];

            con.query(sqlPeliculas, parametros, function(error, peliculas, fields) {
                //si hubo un error, se informa y se envía un mensaje de error
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(500).send("Hubo un error en la consulta");
                }               

                if (peliculas.length < 2)
                {
                    console.log("No se encontraron dos peliculas o mas con los filtros indicados");
                    return res.status(422).send("No se encontraron dos peliculas o mas con los filtros indicados");
                }

                con.query(sqlAgregarCompetencia, [nombre, generoId, directorId], function(error, resultado, fields)
                {
                    if (error) {
                        console.log("Hubo un error en la consulta", error.message);
                        return res.status(500).send("Hubo un error en la consulta");
                    }               
            
                    res.send('Competencia agregada con exito!');
                });
            });            
        });
    },

    reiniciarCompetencia: function(req, res)
    {
        var idCompetencia = req.params.id;

        var sqlCompetencia = "SELECT * FROM competencia WHERE id = ?";
        var sqlReiniciar = "DELETE FROM voto WHERE competencia_id = ?";

        con.query(sqlCompetencia, [idCompetencia], function(error, competencias, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }
            if (competencias.length == 0) {
                console.log("No se encontro ninguna competencia con ese id");
                return res.status(404).send("No se encontro ninguna competencia con ese id");
            } 

            con.query(sqlReiniciar, [idCompetencia], function(error, resultado, fields) {
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(500).send("Hubo un error en la consulta");
                }
    
                res.send('Competencia reiniciada con exito!');
            });    
        });
    },

    buscarCompetencia: function(req, res)
    {
        var idCompetencia = req.params.id;
        var sql = 
            "SELECT competencia.nombre, genero.nombre as genero_nombre, director.nombre as director_nombre FROM competencia " +
            "LEFT JOIN director ON director.id = competencia.director_id " +
            "LEFT JOIN genero ON genero.id = genero_id " +
            "where competencia.id = ?";

        con.query(sql, [idCompetencia], function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }
            if (resultado.length == 0) {
                console.log("No se encontro ninguna competencia con ese id");
                return res.status(404).send("No se encontro ninguna competencia con ese id");
            }

            var response = resultado[0];

            res.send(JSON.stringify(response));
        });
    },

    obtenerGeneros: function(req, res)
    {
        var sql = "select * from genero";

        con.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }
            var response = resultado;

            res.send(JSON.stringify(response));
        });
    },

    obtenerDirectores: function(req, res)
    {
        var sql = "select * from director";

        con.query(sql, function(error, resultado, fields) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }

            var response = resultado;

            res.send(JSON.stringify(response));
        });
    },
}

module.exports = competenciasControlador;