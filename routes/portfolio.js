import express from "express";
const router = express.Router();
import {getPortfolios, createPortfolio} from "../controllers/portfolios.js";

router.get("/", getPortfolios);
router.post("/", createPortfolio);

export default router;
