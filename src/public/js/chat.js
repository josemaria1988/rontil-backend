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
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

const updateMessages = (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user}: ${message.message} </br>`
  });
  log.innerHTML = messages;
}

const addNewMessage = (message) => {
  if (message && message.user && message.message) {
    let log = document.getElementById("messageLogs");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.innerHTML = `<strong>${message.user}:</strong> ${message.message}`;
    log.appendChild(messageDiv);
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