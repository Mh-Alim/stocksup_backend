import express from "express";
import mongoose from "mongoose";

import Portfolio from "../models/portfolio.js";

const router = express.Router();

export const getPortfolios = async (req, res) => {
  try {
    const portfolio = await Portfolio.find();

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPortfolio = async (req, res) => {
  const { name, about, leader } = req.body;

  const newPortfolio = new Portfolio({
    name,
    about,
    tags,
  });

  try {
    await newPortfolio.save();

    res.status(201).json(newPortfolio);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getLineChartData = async (req, res) => {
  try {

  
    const { portfolio_id } = req.body;

    const portfolio = await Portfolio.findById(portfolio_id).populate(
      "soldHistory.user"
    );

    const soldHistory = portfolio.soldHistory;
    console.log("soldHistory ", soldHistory);

    // have to make two arrays
    // line chart data (y-axis data)
    // x axis data
    let x = [];

    let obj = {};
    let lineData = [];
    let totSoldStock = 0;
    let totUser = 0;
    soldHistory.forEach((element) => {
      obj[element.user._id] = element.user._id;
      totSoldStock += element.bought;
      totUser = Object.keys(obj).length;
      console.log(Object.keys(obj), totUser)
      console.log("next itr")

      console.log(element.date.toLocaleString());
      let month = element.date.getMonth();
      let day = element.date.getDay();
      let curr = new Date(Date.now());
      let time;
      if (month === curr.getMonth()) {
        if (day === curr.getDay()) time = `${element.date.getHours()}:${element.date.getMinutes()}`;
        else time = `${day}/${element.date.toLocaleString("default", { month: "long", })}`;
      }
      else time = `${element.date.toLocaleString("default", { month: "long", })}/${element.date.getYear()}`;

      if (x.length > 0 && x[x.length - 1] === time) {
        lineData[lineData.length - 1] = totSoldStock / totUser;
      } else {
        x.push(time);
        lineData.push(totSoldStock / totUser);
      }
    });


    return res.json({
      x,
      lineData,
      totUser,
      totSoldStock
    });
  }
  catch (err) {
    console.log(err.message)
  }
};
export default router;
