const addToCart = async (event) => {
    console.log("addToCart function called");
    const targetButton = event.target;
    const productId = targetButton.dataset.productId;
    const productPrice = parseFloat(targetButton.dataset.price);
    const uid = targetButton.dataset.uid;
    
    
    try {
      let cartResponse = await fetch("http://localhost:8080/api/carts", {
        headers: { "Content-Type": "application/json"},
        credentials: 'include',
      });
      const cart = await cartResponse.json();
  
      // Verificar si la respuesta contiene errores
      if (cart.status === "error") {
        throw new Error(cart.message);
      }
  
      // Comprobar si el producto ya está en el carrito
      const existingItemIndex = cart.items.findIndex((item) => item.product._id === productId);
  
      if (existingItemIndex !== -1) {
        // Si el producto ya está en el carrito, actualizar la cantidad
        const newQuantity = cart.items[existingItemIndex].quantity + 1;
        const updateResponse = await fetch(`http://localhost:8080/api/carts/cart/${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json"},
          credentials: 'include',
          body: JSON.stringify({ quantity: newQuantity }),
        });
  
        if (!updateResponse.ok) {
          throw new Error("No se pudo actualizar la cantidad en el carrito");
        }
  
        alert("Cantidad actualizada en el carrito");
      } else {
        // Si el producto no está en el carrito, agregarlo
        const newProduct = {
          product: productId,
          quantity: 1,
          price: productPrice,
        };
  
        const addResponse = await fetch(`http://localhost:8080/api/carts/cart`, {
          method: "PUT",
          headers: { "Content-Type": "application/json"},
          credentials: 'include',
          body: JSON.stringify({ items: [newProduct] }),
        });
  
        if (!addResponse.ok) {
          throw new Error("No se pudo agregar al carrito");
        }
  
        alert("Producto agregado al carrito");
      }
    } catch (error) {
      console.error(error);
      alert("No se pudo agregar al carrito");
    }
  };

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", addToCart);
  });