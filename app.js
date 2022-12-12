// MODULES
const express = require("express");
const app = express();
require("dotenv").config();
require("express-async-errors");
// IMPORTS
const connectDB = require("./db/connect");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const productRouter = require("./routes/products");

// TOP-MIDDLEWARES
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.send(`<h1>Store API</h1> <a href="/api/v1/products">Products</a>`);
});

// app.use("/auth");
app.use("/api/v1/products", productRouter);

// BOTTOM-MIDDLEWARES
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

// CONNECTION

const start = async () => {
  try {
    //connect DB
    await connectDB(process.env.MONGO_URI);
    app.listen((PORT = process.env.PORT || 5000), () => {
      console.log(
        `Server running at port ${PORT} and successfully connected to DB...`
      );
    });
  } catch (e) {
    console.log(`Has an error => ${e}`);
  }
};
start();
