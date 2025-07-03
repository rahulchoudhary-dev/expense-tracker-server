const dotenv = require("dotenv");
dotenv.config();
const connectToDatabase = require("./config/authenticate.js");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json(express.urlencoded({ extended: true })));

const routes = require("./routes");

const PORT = process.env.PORT || 3000;
connectToDatabase();

app.get("/", (req, res) => {
  res.send("Expense Tracker Server is running!");
});

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
