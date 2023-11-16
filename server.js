const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Admin";
//run when a client connected
io.on("connection", (socket) => {
  socket.on("joinroom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room)
    //when a single client is connects
    //welcomes a new user
    socket.emit("message", formatMessage(botName, "Welcome to ChatApp"));

    //Broadcast to others when user connects,
    //But the user that is connects is not notified
    socket.broadcast.to(user.room).emit(
      "message",
        formatMessage(botName, `${user.username}has joined the chat`)
    );
  });

  //listen to chat message
  socket.on("chatmessage", (msg) => {
    io.emit("message", formatMessage("User", msg));
  });

  //run when someone leaves the chat
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });

  //send message to everybody that is connected
  //io.emit
});

const PORT = 4000 || process.env.PORT;
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
