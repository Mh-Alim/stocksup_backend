import Code from "../models/codeModel.js ";
import jwt from "jsonwebtoken";

const isAuthenticate = async (req, res, next) => {
  try {
    console.log("Authentication");
    const { token } = req.body;
    console.log(token);
    if (!token) {
      return res.status(400).json({
        error: "Token is required",
      });
    }
    const decodedData = await jwt.verify(token, "dhfsdahfskdhfksdhfsd");
    if (!decodedData)
      return res.status(400).json({
        error: "Incorrect token",
      });

    req.id = decodedData.id;
    
    next();
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

export default isAuthenticate;
