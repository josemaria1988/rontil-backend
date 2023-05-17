const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = {};

  data.forEach((value, key) => (obj[key] = value));

  let response = await fetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });

  let result = await response.json();
  console.log(result);

  if (response.status === 200) {
    localStorage.setItem('token', result.token);
    window.location.href = '/api/products';
} else {
    console.log('Error al registrarse:', result.message);
}
});