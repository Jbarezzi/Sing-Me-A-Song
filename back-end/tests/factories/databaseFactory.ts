import { prisma } from "../../src/database";
import { CreateRecommendationData } from "../../src/services/recommendationsService";
import { __createRecommendationInsertData } from "./recommendationFactory";

async function __resetDb() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
}

async function __createData() {
  const data: CreateRecommendationData[] = [];
  for (let i = 0; i < 3; i++) {
    const recommendation = __createRecommendationInsertData();
    data.push(recommendation);
  }

  await prisma.recommendation.createMany({ data });
}

async function __getId() {
  const recommendation = await prisma.recommendation.findFirst();
  return recommendation.id;
}

async function __createDataToDelete() {
  const data = {
    ...__createRecommendationInsertData(),
    score: -6,
  };
  await prisma.recommendation.create({ data });
}

export { __resetDb, __createData, __getId, __createDataToDelete };
