import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

import Portfolio from "./models/portfolio.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// ROUTE IMPORTS

// ERROR MIDDLEWARE -> customErrorHandler
// const PortfolioRoutes = require("./routes/portfolio");
import PortfolioRoutes from "./routes/portfolio.js";
import codeRoutes from "./routes/codeRoutes.js";
// const codeRoutes = require("./routes/codeRoutes.js");

app.use("/portfolios", PortfolioRoutes);
app.use("/api/v1", codeRoutes);
// app.use("/api/v1", codeRoutes);

const PORT = process.env.PORT || 5000;

// lakshman08  b6WipDqxkcIsWIkr

mongoose
  .connect(
    "mongodb+srv://lakshman08:b6WipDqxkcIsWIkr@cluster0.x5iwwjx.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  // .then(() => app.listen(PORT, () => console.log("listening on port " + PORT)))
  .then(() => console.log("Mongodb connected successfully"))
  .catch((issues) => console.log("issues " + issues));

// socket

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://innovationcell-nitrr.github.io/pitcher",
      "http://localhost:3000",
      "https://pitchersfork.netlify.app",
      "https://admin.socket.io",
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("socket is connected");

  // at the starting everone will see this getstock
  socket.on("getStock", async (id, cb) => {
    const totStock = async () => {
      const portfolio = await Portfolio.findById(id);
      console.log(portfolio);
      return portfolio.stock;
    };
    let a = await totStock();

    cb(a);
  });

  socket.on("buy", async (id, buyProd) => {
    console.log(buyProd);
    const totStock = async () => {
      const portfolio = await Portfolio.findById(id);
      if (portfolio.stock < buyProd) {
        socket.emit("stock-empty");
        return portfolio.stock;
      }
      portfolio.stock -= buyProd;
      await portfolio.save();
      return portfolio.stock;
    };
    let remainingStock = await totStock();
    socket.emit("successfully-purchased", buyProd);
    io.to(id).emit("show-stock", remainingStock);
  });

  socket.on("join-room", (room) => {
    socket.leaveAll();
    socket.join(room);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

instrument(io, { auth: false });
