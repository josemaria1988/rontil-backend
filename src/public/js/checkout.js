const confirmButton = document.getElementById('confirm');
const cancelButton = document.getElementById('cancel');

confirmButton.addEventListener('click', async () => {
    try {
      const ticketData = {
        products: availableProducts,
        purchaser: userId,
        amount: total,
      };
    
      const response = await fetch(`/:cid/checkout/confirmation`, {
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