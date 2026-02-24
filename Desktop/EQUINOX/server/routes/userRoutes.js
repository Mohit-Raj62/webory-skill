import express from "express";

import {
  getUserProfileController,
  loginController,
  logoutController,
  registerController,
  updatePasswordController,
  updateProfileController,
  updateProfilePicController,
} from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";

// routes for the application
const router = express.Router();

// routes
// register routes
router.post("/register", registerController);
// login routes
router.post("/login", loginController);
// profile routes
router.get("/profile", isAuth, getUserProfileController);
// login routes
router.get("/logout", isAuth, logoutController);
// update profile routes
router.put("/profile-update", isAuth, updateProfileController);
// update password routes
router.put("/update-password", isAuth, updatePasswordController);
// update profile routes
router.put("/update-picture", isAuth, singleUpload, updateProfilePicController);

// export
export default router;
