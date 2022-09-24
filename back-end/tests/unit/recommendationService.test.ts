import { randSuperheroName } from "@ngneat/falso";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import {
  CreateRecommendationData,
  recommendationService,
} from "../../src/services/recommendationsService";
import { conflictError } from "../../src/utils/errorUtils";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});

describe("recommendation service tests suite", () => {
  it("should create recommendation", async () => {
    const recommendation: CreateRecommendationData = {
      name: randSuperheroName(),
      youtubeLink: "https://www.youtube.com/watch?v=v8bZOBI--L4",
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce(null);
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce(async () => {});

    await recommendationService.insert(recommendation);
    expect(recommendationRepository.create).toBeCalled();
  });

  it("should not create duplicated recommendation", async () => {
    const reccommendation: CreateRecommendationData = {
      name: randSuperheroName(),
      youtubeLink: "https://www.youtube.com/watch?v=v8bZOBI--L4",
    };

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce({ id: 1, score: 0, ...reccommendation });
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce(async () => {});

    const promise = recommendationService.insert(reccommendation);
    expect(promise).rejects.toEqual(
      conflictError("Recommendations names must be unique")
    );
    expect(recommendationRepository.create).not.toBeCalled();
  });

  it.todo("should update score if id exists", async () => {});

  it.todo("should not update score if id doesn't existis");

  it.todo("should update score if id exists");
  it.todo("should not update score if id doesn't existis");

  it.todo("should return random recommendation");
  it.todo("should not return reccommendation if there are none");

  it.todo("should return list of recommendations");
  it.todo("should return a empty list if there are no recommendations");

  it.todo("should return recommendation given a existing id");
  it.todo("should throw not found if id doesn't exist");

  it.todo("should return list of recommendations");
  it.todo("should return a empty list if there are no recommendations");
});
