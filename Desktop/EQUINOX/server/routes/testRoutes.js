import express from "express";
import { testController } from "../controllers/testController.js";

// routes object for
const router = express.Router();

// routes  api
router.get("/testing", testController);

// export routes
export default router;
