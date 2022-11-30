const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes/routes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 42000;
app.use(routes);

app.listen(port, () => {
  console.log("PRODUCTION Running at port: " + port);
});

