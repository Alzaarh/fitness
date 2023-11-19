const { createServer } = require("node:http");
require("dotenv").config();
const app = require("./app");
const { config } = require("./helpers/config");

createServer(app).listen(config.port, () => {
  console.log(`Server Is Running On Port ${config.port}`);
});
