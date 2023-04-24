const updateButtons = document.querySelectorAll('.update-quantity');

updateButtons.forEach(updateButton => {
    updateButton.addEventListener('click', async event => {
        const productId = event.target.dataset.productId;
        const input = event.target.parentElement.querySelector('.quantity-input');
        const newQuantity = input.value;

        const response = await fetch(`/api/carts/cart/products/${productId}`, {
            method: "PUT",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({quantity: Number(newQuantity)})
        });

        if (response.ok) {
            console.log('Cantidad actualizada exitosamente');
            location.reload();
        } else {
            console.error('Error al actualizar la cantidad del producto');
        }
    });
});



const clearCart = async () => {
  try {
    const response = await fetch(`/api/carts/cart`, {
      method: "DELETE",
      headers: {
        'Content-type': 'application/json'
      },
      body: ""
    });

    if (response.ok) {
      console.log('Carrito vaciado con éxito');
      location.reload();
    } else {
      console.error('Error al vaciar el carrito');
    }
  } catch (error) {
    console.log(error);
  }
};

const vaciarCarrito = document.getElementById('clearCart');
vaciarCarrito.addEventListener('click', clearCart);

//BORRAR PRODUCTO DEL CARRITOO

const removeProductButtons = document.querySelectorAll('.cart-product-remove');

removeProductButtons.forEach(removeButton => {
  removeButton.addEventListener('click', async event => {
    const productId = event.target.dataset.productId;

    const response = await fetch(`/api/carts/cart/products/${productId}`, {
      method: "DELETE",
      headers: {
        'Content-type': 'application/json'
      }
    });

    if (response.ok) {
      console.log('Producto eliminado exitosamente');
      location.reload();
    } else {
      console.error('Error al eliminar el producto del carrito');
    }
  });
});