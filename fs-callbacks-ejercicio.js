const fs = require('fs');

// Creamos un archivo y escribimos fecha y hora actual

fs.writeFile('./fecha.txt', new Date().toString(), (error) => {
    if (error) throw error;
    console.log('Se ha creado el archivo fecha.txt');

    // Leemos el archivo y mostramos el resultado por consola

    fs.readFile('./fecha.txt', (error, resultado) => {
        if (error) throw error;
        console.log('El contenido del archivo fecha.txt es: ');
        console.log(resultado.toString());
    })
})