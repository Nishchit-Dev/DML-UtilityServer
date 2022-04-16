const { io } = require("socket.io-client");
var port = process.env.SocketPort;
var socket = io("https://dml-server.herokuapp.com:5656");

socket.on("connect", () => {
  // calling server socket input "industry baby"
  socket.emit("searchQuery", { searchQuery: "trac" });

  // receive socket client side
  socket.on("found", (data) => {
    console.log(JSON.stringify(data));
  });
});
