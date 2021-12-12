const app = require("./app");
const http = require("http");
const logger = require("./utils/loggers");
const port = require("./utils/config").PORT;

const server = http.createServer(app);
server.listen(port, () => logger.info(`Server is running on port${port}`));
