const { io } = require("socket.io-client");
var port = process.env.SocketPort;
var socket = io("http://localhost:"+port);

socket.on("connect", () => {
  // calling server socket input "industry baby"
  socket.emit("searchQuery", { searchQuery: "industry baby" });

  // receive socket client side
  socket.on("found", (data) => {
    console.log(JSON.stringify(data));
  });
});
