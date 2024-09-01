import express from "express";
import { Request, Response } from "express";
import { getAllDiaries, postDiary } from "../controllers/diaries.controllers";

const diariesRouter = express.Router()

const diaries = require("../seeding/data/diaries.json")

diariesRouter.get("/", getAllDiaries)

diariesRouter.post("/", postDiary)

export default diariesRouter