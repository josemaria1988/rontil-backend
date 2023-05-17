import fs from "fs";
import multer from "multer";
import ProductModel from "./dao/models/products.model.js"

//Configurar multer
let storage = multer.diskStorage({
    destination: (req, file, cb) =>  {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

let upload = multer ({storage: storage});

//Leer los datos del archivo json
fs.readFile('./src/dao/files/productos.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error al leer el archivo:', err);
        return
    }

    let productos = JSON.parse(data);

    //Guardado en la base de datos por cada producto, forEach
    productos.forEach(producto => {
        let newProduct = new ProductModel(producto);
        newProduct.save((err, product) => {
            if (err) console.error('Error al guardar el producto:', err);
            else console.log('Producto guardado exitosamente:', product);
        })
    })
})