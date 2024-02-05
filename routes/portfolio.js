import express from "express";
const router = express.Router();
import {getPortfolios, createPortfolio, getLineChartData,currUserRank,audienceRanking,getMultiplier} from "../controllers/portfolios.js";

router.get("/", getPortfolios);
router.get("/multiplier", getMultiplier);
router.post("/", createPortfolio);
router.get("/audienceRanking", audienceRanking)
router.get("/currUserRank",currUserRank)
router.post("/data/line-chart", getLineChartData);


export default router;
