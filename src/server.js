const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const AuthHandler = require('./services/AuthHandler');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const config = require('../config');

console.log("Started with config: \n", config);
// TODO: Add logger

const SERVER_PORT = process.env.PORT || config.PORT;
const SERVER_IP = process.env.IP || config.HOST;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());

const sockets = require('./socket')(io);
const index = require('./routes')();
const timetable = require('./routes/timetable')();
const users = require('./routes/users')();
const polls = require('./routes/polls')(sockets);
const admin = require('./routes/admin')();

app.use("/", index);
app.use("/timetable", timetable);
app.use(AuthHandler.secureRoutes());
app.use("/users", users);
app.use("/polls", polls);
app.use(AuthHandler.secureRoutes(AuthHandler.ROLES.ADMIN));
app.use("/admin", admin);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  return res.status(500).send({error: `Internal Error: ${err.message}`});
});

const server = http.listen(SERVER_PORT, function () {
  console.info(`Dooptha NUWM RESTServer listening on http://${SERVER_IP}:${SERVER_PORT}!`);
});

if(process.env.NODE_ENV === "production") {
  process.on('uncaughtException', function(error) {
    console.error(error);
  });

  process.on('unhandledRejection', function(reason, p) {
    console.error(reason, p);
  });
}

module.exports = server;