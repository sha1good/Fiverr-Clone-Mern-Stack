

import express from "express";
import { verifyToken} from "../middleware/jwt.js";
import { intent, getOrders, confirm} from "../controllers/order.controller.js"

const router = express.Router();

//router.post("/:gigId", verifyToken, createOrder);
router.post("/create-payment-intent/:id", verifyToken, intent);
router.get("/", verifyToken, getOrders);
router.put("/", verifyToken, confirm)

 export default  router;