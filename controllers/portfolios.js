import express from "express";
import mongoose from "mongoose";
import Code from "../models/codeModel.js";

import Portfolio from "../models/portfolio.js";

const router = express.Router();

const updateWorth = async () => {
  
  try {
    const portfolios = await Portfolio.find();
    const portfolioMap = new Map(
      portfolios.map((portfolio) => [
        portfolio._id.toString(),
        portfolio.multiplier,
      ])
    );

    const codes = await Code.find();

    for (const code of codes) {
      code.worth = 0;
      for (const buyRecord of code.buyHistory) {
        const portfolio = portfolios.find(
          (p) => p._id.toString() === buyRecord.portfolio_id
        );

        if (portfolio) {
          const updatedWorth =
            buyRecord.boughtStock * portfolioMap.get(buyRecord.portfolio_id);

          code.worth += updatedWorth;
          // console.log(code.name+ " " +  updatedWorth + " "+ code.worth);
        }
      }

      await code.save();
    }

    console.log("Worth updated successfully!");
  } catch (error) {
    console.error("Error updating worth:", error.message);
  }
};

const sortByWorth = async (pageNumber = 1, pageSize = 10) => {
  try {
    const codes = await Code.find()
      .sort({ rank: "asc" })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return codes;
  } catch (error) {
    throw error;
  }
};

export const audienceRanking = async (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  updateWorth()
  try {
    const codes = await sortByWorth(pageNumber, pageSize);
    const totDocuments = await Code.countDocuments({});
    res.status(200).json({
      users: codes,
      totDocuments,
      pageNumber,
      pageSize: pageSize,
    });
  } catch (error) {
    console.log(error.message);
  }
};


// Assuming the Code model is imported properly

export const updateRanks = async () => {
  try {
    const codes = await Code.find().sort({ worth: -1 }); // Sorting in descending order

    for (const [index, code] of codes.entries()) {
      code.rank = index + 1;
      await code.save();
    }

    console.log("Ranks updated successfully");
  } catch (error) {
    console.error("Error updating ranks:", error.message);
  }
};

export const getAudienceRanking = async (req, res) => {
  try {
    const codes = await Code.find().sort({ rank: 1 }); // Sorting in ascending order of rank
    res.send(codes);
  } catch (error) {
    console.error("Error fetching audience ranking:", error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }


};

export const currUserRank = async (req, res) => {
  try {
    var userId = req.query.userId;
    userId = userId.substring(1, userId.length - 1);
    console.log(userId);
    const user = await Code.findById(userId);
    if (!user) {
      console.log("User not found");
    }
    res.send(user);
  } catch (error) {
    console.error("Error fetching user with rank:", error.message);
    throw error;
  }
};

// updateWorth();

// const sortByWorth = async (pageNumber = 1, pageSize = 10) => {
//   try {
//     const codes = await Code.find()
//       .sort({ worth: 'desc' })
//       .skip((pageNumber - 1) * pageSize)
//       .limit(pageSize)
//       .exec();

//     return codes;
//   } catch (error) {
//     throw error;
//   }
// };

// export const audienceRanking = async (req,res) =>
// {
//   const pageNumber = parseInt(req.query.pageNumber) || 1;
//   const pageSize = parseInt(req.query.pageSize) || 10;
//   try {
//     const codes = await sortByWorth(pageNumber, pageSize)
//     res.send(codes)
//   } catch (error) {
//     console.log(error.message)
//   }
// }

// export const currUserRank = async (req, res) => {
//   const userId = req.query.userId; // Assuming the user ID is part of the request parameters

//   try {
//     const user = await Code.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     const rank = await Code.countDocuments({ worth: { $gt: user.worth } }) + 1;

//     res.json({ user, rank });
//   } catch (error) {
//     console.error("Error retrieving user with rank:", error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

const multiplier = async (multiplierData) => {
  try {
    const port = await Portfolio.find({ name: "Portfolio14" });
    console.log(port);
    // Loop through multiplierData
    for (const portfolioName in multiplierData) {
      if (multiplierData.hasOwnProperty(portfolioName)) {
        // Find the portfolio document by name

        const portfolio = await Portfolio.findOne({ name: portfolioName });

        // Update the multiplier for the found portfolio
        if (portfolio) {
          portfolio.multiplier = multiplierData[portfolioName];
          await portfolio.save();
        }
      }
    }

    // Return success message or handle as needed
    return "Multiplier updated successfully";
  } catch (error) {
    // Handle error
    console.error("Error updating multiplier:", error);
    throw error;
  }
};

// JSON data as a variable
const multiplierData = {
  Portfolio1: 1,
  Portfolio2: 1,
  Portfolio3: 9,
  Portfolio4: 1,
  Portfolio5: 1,
  Portfolio6: 1,
  Portfolio7: 1,
  Portfolio8: 1,
  Portfolio9: 1,
  Portfolio10: 1,
  Portfolio11: 1,
  Portfolio12: 1,
  Portfolio13: 1,
  Portfolio14: 1,
  Portfolio15: 1,
};

// // Example usage
// multiplier(multiplierData)

export const getPortfolios = async (req, res) => {
  try {
    const portfolio = await Portfolio.find();
    const port = await Portfolio.find({ name: "Portfolio14" });
    console.log(port);

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
    if (!portfolio_id) {
      return new Error(`portfolio_id is required`);
    }

    const portfolio = await Portfolio.findById(portfolio_id).populate(
      "soldHistory.user"
    );

    if (!portfolio) {
      return new Error(`portfolio_id is wrong`);
    }

    const soldHistory = portfolio.soldHistory;

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

      let month = element.date.getMonth();
      let day = element.date.getDay();
      let year = element.date.getFullYear();
      let curr = new Date(Date.now());
      let time;
      if (
        day === curr.getDay() &&
        month === curr.getMonth() &&
        year === curr.getFullYear()
      )
        time = `${element.date.toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      else time = `${`${element.date.getDate()}/${element.date.getMonth() + 1}/${element.date.getFullYear()}`}`;
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
      totSoldStock,
    });
  } catch (err) {
    console.log(err.message);
  }
};
export default router;
