import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  try {
    res.status(200).json({ status: "ok", message: "Server is healthy" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;
