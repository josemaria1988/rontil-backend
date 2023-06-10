const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  let response = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    credentials: 'include',
    body: JSON.stringify(obj),
  });

  let result = await response.json();

  if (response.status === 200) {
    window.location.href = '/api/products';
} else {
    console.log('Error al registrarse:', result.message);
}
});