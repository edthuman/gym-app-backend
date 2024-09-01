import express from "express";
import { Request, Response } from "express";
import { getAllDiaries } from "../controllers/diaries.controllers";

const diariesRouter = express.Router()

const diaries = require("../seeding/data/diaries.json")

diariesRouter.get("/", getAllDiaries)

export default diariesRouter