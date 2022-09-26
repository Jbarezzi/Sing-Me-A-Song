import { Router } from "express";
import { testController } from "../controllers/testController.js";
export const testRouter = Router();

testRouter.get("/seed", testController.seedDb);
testRouter.get("/reset", testController.resetDb);
