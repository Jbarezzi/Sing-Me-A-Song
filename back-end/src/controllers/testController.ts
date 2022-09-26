import { Request, Response } from "express";
import { testRepository } from "../repositories/testRepository.js";
import { testService } from "../services/testService.js";

async function seedDb(_req: Request, res: Response) {
  await testService.mockData();
  return res.sendStatus(201);
}
async function resetDb(_req: Request, res: Response) {
  await testRepository.deleteAll();
  return res.sendStatus(204);
}

export const testController = {
  seedDb,
  resetDb,
};
