const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  let response = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    credentials: 'include',
    body: JSON.stringify(obj),
  });

  let result = await response.json();

  if (result.status === "success") {
    window.location.href = "/api/products";
  }
});

document.getElementById("passwordResetLink").addEventListener("click", (event) => {
  event.preventDefault();
  let email = prompt("Ingresa tu dirección de correo electrónico para restablecer tu contraseña");

  if (email) {
    console.log(email)
    fetch('/api/newPass/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email}),
      })
      .then (response => response.json())
      .then (data => {
        if(data.success) {
          alert("Se ha enviado un correo electrónico con instrucciones para restablecer su contraseña")
        } else {
          alert("Algo salió mal: " + data.message);
        }
      })
      .catch((error) => {
        console.error('Error', error)
      })
  }
})