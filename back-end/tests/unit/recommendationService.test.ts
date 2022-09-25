import { randNumber } from "@ngneat/falso";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService";
import { conflictError, notFoundError } from "../../src/utils/errorUtils";
import {
  __createRecommendationList,
  __createRecommendation,
  __createOrderedRecommendationList,
  __createRecommendationInsertData,
} from "../factories/recommendationFactory";

describe("recommendation service tests suite", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it("should create recommendation", async () => {
    const recommendation = __createRecommendationInsertData();

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
    const recommendation = __createRecommendationInsertData();

    jest
      .spyOn(recommendationRepository, "findByName")
      .mockResolvedValueOnce({ id: 1, score: 0, ...recommendation });
    jest
      .spyOn(recommendationRepository, "create")
      .mockImplementationOnce(async () => {});

    const promise = recommendationService.insert(recommendation);
    expect(promise).rejects.toEqual(
      conflictError("Recommendations names must be unique")
    );
    expect(recommendationRepository.create).not.toBeCalled();
  });

  it("should increment score if id exists", async () => {
    const recommendation = __createRecommendation();
    const id: number = recommendation.id;

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
    const id: number = __createRecommendation().id;

    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    jest.spyOn(recommendationRepository, "updateScore");

    const promise = recommendationService.upvote(id);
    expect(promise).rejects.toEqual(notFoundError());
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });

  it("should decrement score if id exists", async () => {
    const recommendation = __createRecommendation();
    const id: number = recommendation.id;

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
    const minMax: { min: number; max: number } = { min: -7, max: -6 };
    const recommendation = __createRecommendation(minMax);
    const id: number = recommendation.id;

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
    const id: number = __createRecommendation().id;

    jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
    jest.spyOn(recommendationRepository, "updateScore");

    const promise = recommendationService.downvote(id);
    expect(promise).rejects.toEqual(notFoundError());
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).not.toBeCalled();
  });

  it("should return random recommendation less than 10", async () => {
    const minMax: { min: number; max: number } = { min: -4, max: 9 };
    const recommendation = __createRecommendation(minMax);

    jest.spyOn(Math, "random").mockReturnValue(0.8);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValue([recommendation]);

    const promise = recommendationService.getRandom();
    expect(promise).resolves.toEqual(recommendation);
    expect((await promise).score).toBeLessThan(10);
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("should return random recommendation greater than 10", async () => {
    const minMax: { min: number; max?: number } = { min: 11 };
    const recommendation = __createRecommendation(minMax);

    jest.spyOn(Math, "random").mockReturnValue(0.6);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValue([recommendation]);

    const promise = recommendationService.getRandom();
    expect(promise).resolves.toEqual(recommendation);
    expect((await promise).score).toBeGreaterThan(10);
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("should not return recommendation if there are none", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

    const promise = recommendationService.getRandom();
    expect(promise).rejects.toEqual(notFoundError());
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("should return list of recommendations", async () => {
    const recommendation = __createRecommendation();

    jest
      .spyOn(recommendationRepository, "findAll")
      .mockResolvedValue([recommendation]);

    const promise = recommendationService.get();
    expect(promise).resolves.toEqual([recommendation]);
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("should return a empty list if there are no recommendations", async () => {
    jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

    const promise = recommendationService.get();
    expect(promise).resolves.toEqual([]);
    expect(recommendationRepository.findAll).toBeCalled();
  });

  it("should return list of recommendations with length equal number", async () => {
    const amount: number = randNumber({ min: 5, max: 20 });
    const recommendations = __createOrderedRecommendationList(amount);

    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockResolvedValue(recommendations);

    const promise = recommendationService.getTop(amount);
    expect(recommendationRepository.getAmountByScore).toBeCalledWith(amount);
    expect(promise).resolves.toEqual(recommendations);
    expect(promise).resolves.toHaveLength(amount);
  });
  it("should return a empty list if there are no recommendations", async () => {
    const amount: number = randNumber({ min: 5, max: 20 });
    const recommendations = [];

    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockResolvedValue(recommendations);

    const promise = recommendationService.getTop(amount);
    expect(recommendationRepository.getAmountByScore).toBeCalledWith(amount);
    expect(promise).resolves.toEqual([]);
    expect(promise).resolves.toHaveLength(0);
  });
});
