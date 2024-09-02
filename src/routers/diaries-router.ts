import express from "express";
import { getAllDiaries, postDiary } from "../controllers/diaries.controllers";
import { sendMethodNotAllowedError } from "../error-handlers";

const diariesRouter = express.Router()

diariesRouter.get("/", getAllDiaries)
diariesRouter.post("/", postDiary)
diariesRouter.use("/", sendMethodNotAllowedError)

export default diariesRouter