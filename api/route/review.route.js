import express from "express";
import { verifyToken } from "../middleware/jwt.js";

import {
  createReview,
  getReviews,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", verifyToken, createReview);
router.delete("/:id", deleteReview);
router.get("/:gigId", getReviews);

 export default router;
