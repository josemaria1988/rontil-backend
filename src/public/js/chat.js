const socket = io();
let user;
let chatBox = document.getElementById("chatBox");

Swal.fire({
  title: "Identificate",
  input: "text",
  text: "Alerta basica con Sweetalert2",
  inputValidator: (value) => {
    return !value && "Necesitas escribir un nombre de usuario para continuar";
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;
  socket.emit("user-autenticated", user);
});

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { username: user, message: chatBox.value }); // Cambiado 'user' a 'username'
      chatBox.value = "";
    }
  }
});

const updateMessages = (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages += `${message.username}: ${message.message} </br>` // Cambiado 'message.user' a 'message.username'
  });
  log.innerHTML = messages;
}

const addNewMessage = (message) => {
  if (message && message.username && message.message) { // Cambiado 'message.user' a 'message.username'
    let log = document.getElementById("messageLogs");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.innerHTML = `<strong>${message.username}:</strong> ${message.message}`; // Cambiado 'message.user' a 'message.username'
    log.appendChild(messageDiv);
    window.reload() 
  } else {
    console.error("Mensaje recibido con estructura incorrecta:", message);
  }
}

socket.on("newMessage", (messageArray) => {
  if (messageArray && messageArray.length > 0) {
    addNewMessage(messageArray[0]);
  } else {
    console.error("Array de mensajes recibido vacío o inválido:", messageArray);
  }
});
socket.on("messageLogs", (data) => {
  updateMessages(data);
});

socket.on("user-connected", (data) => {
  Swal.fire({
    text: "Nuevo usuario autenticado",
    toast: true,
    position: "top-right",
    title: `${data} se ha unido al chat`,
    icon: "success",
  });
});