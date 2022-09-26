import { prisma } from "../database";

async function insert(data: any) {
  await prisma.recommendation.createMany({ data });
  return;
}

async function deleteAll() {
  await prisma.recommendation.deleteMany({});
  return;
}

export const testRepository = {
  insert,
  deleteAll,
};
