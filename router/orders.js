import express from "express";
import { getِAll, get, create, update, del } from "../controller/orders.js";
const router = express.Router();

router.get("/", verfiyToken, getِAll);
router.get("/:id", verfiyToken, get);
router.post("/", verfiyToken, create);
router.patch("/:id", verfiyToken, update);
router.delete("/:id", verfiyToken, del);

export default router;
