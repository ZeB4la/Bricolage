const express = require("express");
const connectDB = require("./api/config/db");
const routes = require("./api/routes");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

connectDB();

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(cors());

app.use(express.json());

for (const route of routes) {
  app.use(route.path, route.router);
}

app.listen(port, () => {
  console.log(`Server On --> http://localhost:${port}`);
});
