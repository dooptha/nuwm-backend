const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

const config = require('../config');

console.log("Started with config: \n", config);

const DEFAULT_PORT = process.env.PORT || config.PORT;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());

const index = require('./routes')();
const timetable = require('./routes/timetable')();

app.use("/", index);
app.use("/timetable", timetable);

app.listen(DEFAULT_PORT, function () {
  console.log(`Dooptha NUWM RESTServer listening on port ${DEFAULT_PORT}!`);
});