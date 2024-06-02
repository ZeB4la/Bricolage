const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");
const stockRouter = require("./routers/stockRouter");

const routes = [
  { path: "/api/user", router: userRouter },
  { path: "/api/category", router: categoryRouter },
  { path: "/api/product", router: productRouter },
  { path: "/api/stock", router: stockRouter },
];

module.exports = routes;
