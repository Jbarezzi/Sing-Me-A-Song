import { prisma } from "../database.js";

async function insert(data: any) {
  await prisma.recommendation.createMany({ data });
  return;
}

async function deleteAll() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
  return;
}

export const testRepository = {
  insert,
  deleteAll,
};
