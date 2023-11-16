const chatForm = document.getElementById("chat-form");
const chatmessages = document.querySelector('.chat-messages')

//Get Username and room from url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const socket = io();

//join chat room
socket.emit('joinRoom',{username, room})
//message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //scroll down
    chatmessages.scrollTop = chatmessages.scrollHeight;
});

//to submit message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get message text
  const msg = e.target.elements.msg.value;

  //emiting message to server
  socket.emit("chatmessage", msg);
  //clear chat
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

});

//message
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p> ${message.username} <span>${message.time}</span></p>
  <p> ${message.text}</p>`;
  document.querySelector(".chat-messages").appendChild(div);
}
