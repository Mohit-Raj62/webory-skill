import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    // validate
    if (!name || !email || !password || !phone || !address) {
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
    const hashedpassword = await hashPassword(password);
    // save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
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
      message: "Error registering !",
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