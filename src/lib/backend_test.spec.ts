import { describe, it, expect, vi } from "vitest";
import { GetBrandsUseCase } from "./application/use_cases";
import { IBrandRepository } from "./domain/repositories";

describe("GetBrandsUseCase", () => {
  it("should return all brands from the repository", async () => {
    // Mock Repository (Adapter Mock)
    const mockBrandRepo: IBrandRepository = {
      findAll: vi.fn().mockResolvedValue([
        { id: "1", name: "Rolex" },
        { id: "2", name: "Gucci" }
      ]),
      findById: vi.fn(),
      findByCategory: vi.fn()
    };

    const useCase = new GetBrandsUseCase(mockBrandRepo);
    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Rolex");
    expect(mockBrandRepo.findAll).toHaveBeenCalledTimes(1);
  });
});
