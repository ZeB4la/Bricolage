const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");

const routes = [
  { path: "/api/user", router: userRouter },
  { path: "/api/category", router: categoryRouter },
];

module.exports = routes;
