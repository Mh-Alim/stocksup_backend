import express from "express";
import mongoose from "mongoose";

import Portfolio from "../models/portfolio.js";

const router = express.Router();

export const getPortfolios = async (req, res) => {
  try {
    const portfolio = await Portfolio.find();

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
};

export const createPortfolio = async (req, res) => {
  const {name, about,leader} = req.body;

  const newPortfolio = new Portfolio({
    name,
    about,
    tags,
  });

  try {
    await newPortfolio.save();

    res.status(201).json(newPortfolio);
  } catch (error) {
    res.status(409).json({message: error.message});
  }
};

export default router;
