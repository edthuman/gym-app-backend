import express from "express";
import { getAllDiaries, getDiaryById, postDiary } from "../controllers/diaries.controllers";
import { sendMethodNotAllowedError } from "../error-handlers";

const diariesRouter = express.Router()

diariesRouter.get("/", getAllDiaries)
diariesRouter.post("/", postDiary)
diariesRouter.get("/:diary_id", getDiaryById)
diariesRouter.use("/", sendMethodNotAllowedError)

export default diariesRouter