import express from "express";
import { deleteDiary, getAllDiaries, getDiaryById, patchDiary, postDiary } from "../controllers/diaries.controllers";
import { sendMethodNotAllowedError } from "../error-handlers";

const diariesRouter = express.Router()

diariesRouter.get("/", getAllDiaries)
diariesRouter.post("/", postDiary)
diariesRouter.get("/:diary_id", getDiaryById)
diariesRouter.delete("/:diary_id", deleteDiary)
diariesRouter.patch("/:diary_id", patchDiary)
diariesRouter.use("/", sendMethodNotAllowedError)

export default diariesRouter