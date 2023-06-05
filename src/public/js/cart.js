const updateButtons = document.querySelectorAll('.update-quantity');

updateButtons.forEach(updateButton => {
    updateButton.addEventListener('click', async event => {
        const productId = event.target.dataset.productId;
        const input = event.target.parentElement.querySelector('.quantity-input');
        const newQuantity = input.value;

        const response = await fetch(`/api/carts/cart/${productId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            credentials: 'include',
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
      headers: { "Content-Type": "application/json"},
      credentials: 'include',
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

    const response = await fetch(`/api/carts/cart/${productId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json"},
      credentials: 'include',
    });

    if (response.ok) {
      console.log('Producto eliminado exitosamente');
      location.reload();
    } else {
      console.error('Error al eliminar el producto del carrito');
    }
  });
});

//FINALIZAR COMPRA

const checkoutButton = document.getElementById('finalizar-compra');
const cid = document.querySelector('#cartId').textContent;

checkoutButton.addEventListener('click', () => {
  fetch(`/api/carts/${cid}/checkout`, {
    method: 'GET',
    credentials: 'include',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.missingProducts && data.missingProducts.length > 0) {
      const missingProducts = data.missingProducts.map(item => `${item.title}: faltan ${item.quantity} unidades`).join(', ');
      alert(`No hay suficiente stock para los siguientes productos: ${missingProducts}`);
    }
    // Independientemente de si hay productos faltantes, redirigimos a la página de checkout
    window.location.href = '/checkout';
  })
  .catch(error => {
    console.error('Error al realizar el checkout:', error);
    alert("Error al realizar el checkout, por favor intente de nuevo más tarde.");
  })
})