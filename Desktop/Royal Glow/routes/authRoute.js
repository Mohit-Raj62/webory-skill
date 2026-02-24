import express from "express";
import {
  registerController,
  loginController,
  testController,
  contactController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  getMessageController,
  getWishlistController,
 
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// forgotPasswordController

// routes
const router = express.Router();

// routing routes
// Register routes  || Method POst routes
router.post("/register", registerController);

// contact routes
router.post("/contact", contactController);

// // Login routes || Method POst routes
router.post("/login", loginController);

// // forgot password routes
router.post('/forgot-password', forgotPasswordController);

// // test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected  Dash routes || user 
//protected  Dash routes || user 
router.get('/user-auth', requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
// protected Dash routes || Admin
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
// UPDATE routes profile
router.put('/profile', requireSignIn, updateProfileController)

// orders
router.get('/orders', requireSignIn, getOrdersController);

// wishlist routes
router.get('/wishlist', requireSignIn,getWishlistController);

//  All orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

// order updates
router.put('/order-status/:orderId', requireSignIn, orderStatusController);
 // message status updates
router.get('/message' ,requireSignIn, getMessageController);


export default router;
