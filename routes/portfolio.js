import express from "express";
const router = express.Router();
import {getPortfolios, createPortfolio, getLineChartData,currUserRank,getAudienceRanking} from "../controllers/portfolios.js";

router.get("/", getPortfolios);
router.post("/", createPortfolio);
router.get("/audienceRanking", getAudienceRanking)
router.get("/currUserRank",currUserRank)
router.post("/data/line-chart", getLineChartData);


export default router;
