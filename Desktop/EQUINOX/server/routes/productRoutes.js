import express from "express";
import { isAuth } from "../middlewares/authMiddleware.js";

import {
  createProductController,
  getAllProductsController,
  getSingleProductController,
} from "../controllers/productController.js";
// import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// routes

// ============== PRODUCT ROUTES ==================

// GET ALL PRODUCTS
router.get("/get-all", getAllProductsController);

// GET SINGLE PRODUCTS
router.get("/:id", getSingleProductController);

// CREATE PRODUCT singleUpload,
router.post("/create", isAuth, createProductController);
export default router;
