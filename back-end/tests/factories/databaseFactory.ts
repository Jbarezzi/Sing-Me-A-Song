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

export { __resetDb, __createData };
