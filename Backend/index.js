const express = require("express");
const cors = require("cors");
const connectDB = require("./connector.js");
const bodyParser = require("body-parser");
const routes = require("./routes/routes.js");

const port = 8463;
const app = express();

app.use(bodyParser.json());
app.use(cors());

connectDB.connectDB();
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log(`Link : http://localhost:${port}`);
  console.log("🚐 💨💨 Server running ");
});
