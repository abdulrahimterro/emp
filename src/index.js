process.env.TZ = "UTC";
const { port } = require("../configs");
const database = require("./database");
const express = require("express");

const start = async () => {
  console.info("Connecting to DB.");
  await database.authenticate();
  console.info("DB IS READY.");

  /*******************
   * @initialization *
   *******************/

  const app = express();
  require("./app")(app);

  /***********
   * @Server *
   ***********/
  const httpServer = require("http").createServer(app);
  // initialize socket
  require("./socket")(httpServer);
  // Server Connection
  httpServer.listen(port, () => {
    console.info(`server is running on port ${port} ... `);
  });
};
start().catch((err) => console.error(err));
