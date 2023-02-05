// require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
// ROUTE IMPORTS

// ERROR MIDDLEWARE -> customErrorHandler
// const PortfolioRoutes = require("./routes/portfolio");
import PortfolioRoutes from "./routes/portfolio.js";

app.use("/portfolios", PortfolioRoutes);

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
  .then(() => app.listen(PORT, () => console.log("listening on port " + PORT)))
  .catch((issues) => console.log("issues " + issues));
