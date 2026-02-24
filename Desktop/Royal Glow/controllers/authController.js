import { comparePassword, hashpassword } from "../helpers/authHelper.js";
import messageModel from "../models/messageModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
// import { hashpassword } from './../helpers/authHelper';

// register Model
export const registerController = async (req, res) => {
  try {
    const { name, last, email, password, phone, address, answer } = req.body;
    // validate input
    if (
      !name ||
      !last ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !answer
    ) {
      return res.send({ message: "please enter valid information Required !" });
    }
    // user model
    const existinguser = await userModel.findOne({ email });

    // existing user
    if (existinguser) {
      return res.status(200).send({
        success: false,
        message: "Already Existing Pls LOGIN !",
      });
    }
    // register user
    const hashedpassword = await hashpassword(password);
    // save
    const user = await new userModel({
      name,
      last,
      email,
      phone,
      address,
      answer,
      password: hashedpassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "User successfully registered",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration ",
      error,
    });
  }
};
// login controller.
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validate email
    if (!email || !password) {
      res.status(404).send({
        success: false,
        message: "Please validate Email or Password",
      });
    }
    // check user password
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid email ! Please enter valid email",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password ! Please enter valid password",
      });
    }
    // token
    const token = await JWT.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "99days" }
    );
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        // _id: user._id,
        name: user.name,
        last: user.last,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};
// test controller+
export const testController = (req, res) => {
  res.send("protected test routes");
};
// contact controller
export const contactController = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const existingmess = await messageModel
      .findOne({ email })
      .populate("messages");
    // existing user
    if (existingmess) {
      return res.status(200).send({
        success: false,
        message: "Already Existing Pls LOGIN !",
      });
    }
    // save
    const messages = await new messageModel({
      name,
      email,
      message,
    }).save();
    res.status(201).send({
      success: true,
      message: "User successfully message",
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration ",
      error,
    });
  }
};

// Forgot password confirmation
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //  check
    const user = await userModel.findOne({ email, answer });
    // validate
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashpassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password has been updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

// update profile contt
export const updateProfileController = async (req, res) => {
  try {
    const { name, last, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    // password
    if (password && password.length < 6) {
      return res.json({
        error: "password is required",
        message: "Password is at least 6 characters",
      });
    }
    const hashedpassword = password ? await hashpassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        last: last || user.last,
        password: hashedpassword || user.password,
        email: email || user.email,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Password updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Something went Update wrong",
    });
  }
};

// order users
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Something went geting orders",
      error,
    });
  }
};

// All orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Something went geting orders",
      error,
    });
  }
};

// Updete order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Not Status updated",
      error,
    });
  }
};

// message status user
export const getMessageController = async (req, res) => {
  try {
    const status = await messageModel
      .find({ message: req.user._id })
      .populate("messages")
      .populate("message", "name");
    res.json(status);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Something went geting orders",
      error,
    });
  }
};

// wishlist
export const getWishlistController = async (req, res) => {
  try {
    const orders = await productModel
      .find({ products: req.user._id })
      .populate("products", "-photo")
      .populate("products", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Something went geting orders",
      error,
    });
  }
};
