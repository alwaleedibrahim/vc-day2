import express from "express";
import { getِAll, get, create, update, del } from "../controller/posts.js";
const router = express.Router();

router.get("/", getِAll);
router.get("/:id", get);
router.post("/", verfiyToken, create);
router.patch("/:id", verfiyToken, update);
router.delete("/:id", verfiyToken, del);

export default router;
