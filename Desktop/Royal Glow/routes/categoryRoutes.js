import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  categoryController,
  createCategoryController,
  deleteController,
  singleController,
  updateCategoryController,
} from "../controllers/categoryController.js";

const router = express.Router();

//  router.
// create category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// getALl categories
router.get("/get-category", categoryController);

// single category
router.get("/single-category/:slug", singleController);

// delete category
router.delete("/delete-category/:id", requireSignIn, isAdmin, deleteController);

export default router;
