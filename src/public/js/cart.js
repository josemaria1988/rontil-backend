const updateButtons = document.querySelectorAll('.update-quantity');
const cid = document.getElementById('cartId').textContent;

updateButtons.forEach(updateButton => {
    updateButton.addEventListener('click', async event => {
        const productId = event.target.dataset.productId;
        const input = event.target.parentElement.querySelector('.quantity-input');
        const newQuantity = input.value;

        const response = await fetch(`/api/carts/${cid}/products/${productId}`, {
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
        const response = await fetch(`/api/carts/${cid}`, {
            method: "DELETE",
            headers: {
                'Content-type': 'application/json'
            },
            body: ""
        });
    } catch (error) {
        console.log(error);
    }

    if (response.ok) {
        console.log('Carrito vaciado con éxito');
        location.reload();
      } else {
        console.error('Error al vaciar el carrito');
      }
};

const vaciarCarrito = document.getElementById('clearCart');
vaciarCarrito.addEventListener('click', clearCart);

//BORRAR PRODUCTO DEL CARRITOO

const removeProductButtons = document.querySelectorAll('.cart-product-remove');

removeProductButtons.forEach(removeButton => {
  removeButton.addEventListener('click', async event => {
    const productId = event.target.dataset.productId;

    const response = await fetch(`/api/carts/${cid}/products/${productId}`, {
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