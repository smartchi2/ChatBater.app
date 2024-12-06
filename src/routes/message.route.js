import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, sendMessage, getUserForSideBar} from "../controller/message.controller.js";

const router = express.Router();

router.get("/user", protectRoute, getUserForSideBar);
// router.get("/user", protectRoute, getUserForSideBar)
router.get("/:id", protectRoute, getMessages)

router.post("/send/:id", protectRoute, sendMessage)

export default router;