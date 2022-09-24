import { randNumber, randSuperheroName } from "@ngneat/falso";
import { Recommendation } from "@prisma/client";

function __createRecommendation(minMax: object = { min: -4, max: 50 }) {
  const recommendation: Recommendation = {
    id: randNumber(),
    name: randSuperheroName(),
    youtubeLink: "https://www.youtube.com/watch?v=v8bZOBI--L4",
    score: randNumber(minMax),
  };

  return recommendation;
}

function __createRecommendationList(
  length: number,
  minMax: object = { min: -4, max: 50 }
) {
  const recommendations: Recommendation[] = [];
  for (let i = 0; i < length; i++) {
    const recommendation = __createRecommendation(minMax);
    recommendations.push(recommendation);
  }

  return recommendations;
}

function __createOrderedRecommendationList(length: number) {
  const recommendations: Recommendation[] = __createRecommendationList(length);
  recommendations.sort(
    (a: Recommendation, b: Recommendation) => b.score - a.score
  );
  return recommendations;
}

export {
  __createRecommendation,
  __createRecommendationList,
  __createOrderedRecommendationList,
};
