import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// middleware
export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
  // validate
  if (!token) {
    return res.status(401).send({
      success: false,
      message: " UnAuthorized use and Invalid token",
    });
  }
  const decodeData = JWT.verify(token, process.env.JWT_SECRET);
  req.user = await userModel.findById(decodeData._id);
  next();
};
