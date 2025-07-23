const dotenv = require("dotenv");
dotenv.config();

const connectToDatabase = require("./config/authenticate.js");
const express = require("express");
const routes = require("./routes");
const cors = require("cors");

const app = express();
app.use(express.json(express.urlencoded({ extended: true })));
app.use(cors());

connectToDatabase();

require("./models/associations.js");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Expense Tracker Server is running!");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
