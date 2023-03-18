import ProductManager from "../Managers/ProductManager.js";

const socket = io();

const manager = new ProductManager();

const crearProducto = async () => {

    const stock = document.getElementById('stock').value;

    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: document.getElementById('price').value,
        stock: stock,
        category: document.getElementById('category').value,
        status: stock >= 1 ? true : false,
        thumbnails: []
    }

    await manager.addProduct(newProduct);

    socket.emit('nuevo_producto', newProduct);
}

const btnCrearProducto = document.getElementById('btnCrearProducto');
btnCrearProducto.addEventListener('click', (event) => {
    event.preventDefault();
    crearProducto();
});

socket.on('producto_creado', (producto) => {
    console.log('Nuevo producto:', producto);

    // Agregar el nuevo producto a la lista en la vista
    const listaProductos = document.getElementById('lista-productos');
    const nuevoProducto = document.createElement('li');
    nuevoProducto.textContent = `${producto.titulo} - ${producto.descripcion} - ${producto.precio}`;
    listaProductos.appendChild(nuevoProducto);
});