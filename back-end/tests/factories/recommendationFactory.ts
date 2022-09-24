import { randNumber, randSuperheroName } from "@ngneat/falso";
import { Recommendation } from "@prisma/client";

function createRecommendation(minMax: object = { min: -4, max: 50 }) {
  const recommendation: Recommendation = {
    id: randNumber(),
    name: randSuperheroName(),
    youtubeLink: "https://www.youtube.com/watch?v=v8bZOBI--L4",
    score: randNumber(minMax),
  };

  return recommendation;
}

function createRecomendationList(
  minMax: object = { min: -4, max: 50 },
  length: number
) {
  const recommendations = [];
  for (let i = 0; i < length; i++) {
    const recommendation = createRecommendation(minMax);
    recommendations.push(recommendation);
  }

  return recommendations;
}

export { createRecommendation, createRecomendationList };
