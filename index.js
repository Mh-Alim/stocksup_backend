import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

import PortfolioRoutes from "./routes/portfolio.js";
import codeRoutes from "./routes/codeRoutes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://innovationcell-nitrr.github.io",
      "http://localhost:3000",
      "https://pitchersfork.netlify.app",
      "https://main--pitchersfork.netlify.app",
      "https://admin.socket.io",
    ],
    credentials: true,
  },
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/portfolios", PortfolioRoutes);
app.use("/api/v1", codeRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://lakshman08:b6WipDqxkcIsWIkr@cluster0.x5iwwjx.mongodb.net/?retryWrites=true&w=majority";

(async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongodb connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
})();

io.on("connection", (socket) => {
  console.log("socket is connected");

  socket.on("getStock", async (id, userId, cb) => {
    try {
      const portfolio = await Portfolio.findById(id);
      const user = await Code.findById(userId);
      const totStock = [portfolio.stock, user.userStock];
      cb(totStock);
    } catch (error) {
      console.log("Error getting stock", error);
    }
  });

  socket.on("buy", async (id, userId, buyProd) => {
    let flag = false;
    try {
      const portfolio = await Portfolio.findById(id);
      const user = await Code.findById(userId);

      if (user.userStock < buyProd) {
        socket.emit("userStock-empty");
        const totStock = [portfolio.stock, user.userStock];
        io.to(id).emit("show-stock", totStock);
        socket.emit("show-userStock", totStock);
        return;
      }

      if (portfolio.stock < buyProd) {
        socket.emit("stock-empty");
        const totStock = [portfolio.stock, user.userStock];
        io.to(id).emit("show-stock", totStock);
        socket.emit("show-userStock", totStock);
        return;
      }

      flag = true;
      portfolio.stock -= buyProd;
      user.userStock -= buyProd;
      await user.save();
      await portfolio.save();
      const remainingStock = [portfolio.stock, user.userStock];
      io.to(id).emit("show-stock", remainingStock);
      socket.emit("show-userStock", remainingStock);
    } catch (error) {
      console.log("Error buying stock", error);
    }

    if (flag) {
      socket.emit("successfully-purchased", buyProd);
    }
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
