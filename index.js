import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

import Portfolio from "./models/portfolio.js";
import Code from "./models/codeModel.js";

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
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("socket is connected");

  // at the starting everone will see this getstock
  socket.on("getStock", async (id, userId, cb) => {
    const totStock = async () => {
      const portfolio = await Portfolio.findById(id);
      const user = await Code.findById(userId);
      return [portfolio.stock, user.userStock];
    };
    let a = await totStock();

    cb(a);
  });

  socket.on("buy", async (id, userId, buyProd) => {
    let flag = false;
    const totStock = async () => {
      const portfolio = await Portfolio.findById(id);
      const user = await Code.findById(userId);

      if (user.userStock < buyProd) {
        socket.emit("userStock-empty");
        return [portfolio.stock, user.userStock];
      }
      if (portfolio.stock < buyProd) {
        socket.emit("stock-empty");
        return [portfolio.stock, user.userStock];
      }

      flag = true;
      const idx = user.buyHistory.findIndex(
        (element) => element.portfolio_id === id
      );

      if (idx == -1) {
        let obj = {
          portfolio_id: id,
          boughtStock: buyProd,
        };
        user.buyHistory.push(obj);
      } else {
        console.log("buyProd", typeof buyProd);
        console.log("boughtstock", typeof user.buyHistory[idx].boughtStock);
        user.buyHistory[idx].boughtStock += buyProd;
      }
      portfolio.stock -= buyProd;
      user.userStock -= buyProd;
      await user.save();
      await portfolio.save();
      return [portfolio.stock, user.userStock];
    };
    let remainingStock = await totStock();
    if (flag) socket.emit("successfully-purchased", buyProd);
    io.to(id).emit("show-stock", remainingStock);
    socket.emit("show-userStock", remainingStock);
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
