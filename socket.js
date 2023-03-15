import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import Portfolio from "./models/portfolio.js";
import Code from "./models/codeModel.js";

const callToSocket = (server) => {
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
      buyProd = parseInt(buyProd, 10);
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

  instrument(io, { auth: false });
};

export default callToSocket;
