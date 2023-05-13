import stockProductos from "./realProducts.js";
import fs from "fs"

let json = JSON.stringify(stockProductos, null, 2);

fs.writeFile('productos.json', json, (err) => {
    if (err) throw err;
    console.log('Archivo de productos json creado con éxito')
});