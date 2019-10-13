
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
        var sqlPeliculas = "SELECT * FROM pelicula ORDER BY rand() LIMIT 2";
        var sqlCompetencia = "SELECT * FROM competencia WHERE id = ?";

        //se ejecuta la consulta
        con.query(sqlCompetencia, [competenciaId], function(error, competencias, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }

            con.query(sqlPeliculas, function(error, peliculas, fields) {
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
    }
}

module.exports = competenciasControlador;