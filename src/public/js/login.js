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