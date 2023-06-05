const confirmButton = document.getElementById('confirm');
const cancelButton = document.getElementById('cancel');
const productElements = document.querySelectorAll('.product-id');
const availableProducts = Array.from(productElements).map(elem => elem.textContent);
const totalText = document.getElementById('totalAmount').textContent;
const total = parseFloat(totalText.split(': ')[1]);
const cid = document.getElementById('cartId').textContent.split(' ')[5];

confirmButton.addEventListener('click', async () => {
    try {
      const ticketData = {
        products: availableProducts,
        purchaser: '',
        amount: total,
      };
    
      const response = await fetch(`/api/carts/${cid}/checkout/confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify(ticketData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Ticket generado:', responseData.ticket);
  
      // Redirige al usuario a la página de confirmación, o muestra un mensaje de éxito, etc.
  
    } catch (error) {
      console.error('Error al generar el ticket:', error);
    }
  });