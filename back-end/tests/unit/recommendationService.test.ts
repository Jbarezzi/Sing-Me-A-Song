import { randNumber, randSuperheroName } from "@ngneat/falso";
import { Recommendation } from "@prisma/client";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import {
  CreateRecommendationData,
  recommendationService,
} from "../../src/services/recommendationsService";
import { conflictError, notFoundError } from "../../src/utils/errorUtils";

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

  it("should increment score if id exists", async () => {
    const id: number = randNumber();
    const recommendation: Recommendation = {
      id: 1,
      name: randSuperheroName(),
      youtubeLink: "https://www.youtube.com/watch?v=v8bZOBI--L4",
      score: 9,
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce(recommendation);

    await recommendationService.upvote(id);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("should not increment score if id doesn't existis", async () => {
    const id: number = randNumber();

    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    jest.spyOn(recommendationRepository, "updateScore");

    const promise = recommendationService.upvote(id);
    expect(promise).rejects.toEqual(notFoundError());
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });

  it("should decrement score if id exists", async () => {
    const id: number = randNumber();
    const recommendation: Recommendation = {
      id: 1,
      name: randSuperheroName(),
      youtubeLink: "https://www.youtube.com/watch?v=v8bZOBI--L4",
      score: 9,
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce(recommendation);

    await recommendationService.downvote(id);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
  });

  it("should decrement score if id exists and remove if score less than -5", async () => {
    const id: number = randNumber();
    const recommendation: Recommendation = {
      id: 1,
      name: randSuperheroName(),
      youtubeLink: "https://www.youtube.com/watch?v=v8bZOBI--L4",
      score: -6,
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValueOnce(recommendation);
    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValueOnce(recommendation);
    jest.spyOn(recommendationRepository, "remove").mockResolvedValue();

    await recommendationService.downvote(id);
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalled();
  });

  it("should not decrement score if id doesn't existis", async () => {
    const id: number = randNumber();

    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    jest.spyOn(recommendationRepository, "updateScore");

    const promise = recommendationService.downvote(id);
    expect(promise).rejects.toEqual(notFoundError());
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });

  it("should return random recommendation less than 10", async () => {
    jest.spyOn(Math, "random").mockImplementationOnce(() => 0.8);
    jest.spyOn(recommendationRepository, "findAll");
  });
  it.todo(
    "should not return reccommendation if there are none",
    async () => {}
  );

  it.todo("should return list of recommendations", async () => {});
  it.todo(
    "should return a empty list if there are no recommendations",
    async () => {}
  );

  it.todo("should return recommendation given a existing id", async () => {});
  it.todo("should throw not found if id doesn't exist", async () => {});

  it.todo("should return list of recommendations", async () => {});
  it.todo(
    "should return a empty list if there are no recommendations",
    async () => {}
  );
});
