import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  brainTreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteproductController,
  filterProductController,
  getProductsController,
  getSingleProductsController,
  productCategoryController,
  productCountController,
  productListController,
  productPhotosController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

// routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
// all  get products routes;
router.get("/get-product", getProductsController);

// single get product routes:
router.get("/get-product/:slug", getSingleProductsController);

// // get photos routes
router.get("/product-photo/:pid", productPhotosController);

// //  delete product routes
router.delete("/delete-product/:pid", deleteproductController);

// update product routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

// // Filter product routes
router.post("/filters-product", filterProductController);

// // product count routes
router.get("/product-count", productCountController);

// // product list routes
router.get("/product-list/:page", productListController);

// // search routes
router.get("/search/:keyword", searchProductController);

// // similar routes product
router.get("/related-product/:pid/:cid", relatedProductController);

// // category wise routes
router.get("/product-category/:slug", productCategoryController);

// payment routes
// tokens
router.get('/braintree/token', braintreeTokenController);

// payment 
router.post('/braintree/payment', requireSignIn, brainTreePaymentController);

export default router;
