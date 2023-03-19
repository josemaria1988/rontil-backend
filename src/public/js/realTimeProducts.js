const socket = io();

const formCrearProducto = document.getElementById('formCrearProducto');

formCrearProducto.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(formCrearProducto);

  const newProduct = {
    title: formData.get('title'),
    description: formData.get('description'),
    code: formData.get('code'),
    price: formData.get('price'),
    stock: formData.get('stock'),
    category: formData.get('category'),
    status: formData.get('stock') >= 1 ? true : false,
    thumbnails: []
  };

  console.log('Nuevo producto:', newProduct);

  socket.emit('nuevo_producto', newProduct);
});


socket.on('updateProducts', (data) => {
    const allProducts = data.products;
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';
  
    allProducts.forEach((producto) => {
      const nuevoProducto = document.createElement('li');
      nuevoProducto.textContent = `${producto.title} - ${producto.description} - ${producto.price}`;
      listaProductos.appendChild(nuevoProducto);
    });
  });