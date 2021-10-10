const init = (httpServer) => {
  const io = require("socket.io")(httpServer, { path: "/api/socket", cors: { origin: "*" } });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (data) => socket.join(data));
  });

  global.io = io;
};

module.exports = init;
