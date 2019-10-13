
//se importa una referencia a la conexión.
var con = require('../lib/conexionbd');

var competenciasControlador = {
    obtenerCompetencias: function (req, res) {
    
        console.log('Hola mundo');

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
    }    
}

module.exports = competenciasControlador;