import { Request, Response } from "express";
import { testRepository } from "../repositories/testRepository";
import { testService } from "../services/testService";

async function seedDb(_req: Request, res: Response) {
  await testService.mockData();
  return res.status(201);
}
async function resetDb(_req: Request, res: Response) {
  await testRepository.deleteAll();
  return res.status(204);
}

export const testController = {
  seedDb,
  resetDb,
};
