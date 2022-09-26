import { Router } from "express";
import { testController } from "../controllers/testController";
export const testRouter = Router();

testRouter.get("/seed", testController.seedDb);
testRouter.get("/reset", testController.resetDb);
