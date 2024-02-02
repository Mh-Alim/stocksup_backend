import express from "express";
const router = express.Router();
import {getPortfolios, createPortfolio, getLineChartData} from "../controllers/portfolios.js";

router.get("/", getPortfolios);
router.post("/", createPortfolio);
router.post("/data/line-chart", getLineChartData);

export default router;
