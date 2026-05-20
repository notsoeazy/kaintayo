import { pickRandomPlace, type RandomizerFilters } from "../randomizer_service";
import type { Place } from "@/types";

const mockPlaces: Place[] = [
  {
    id: "place1",
    name: "Place A",
    categories: ["silog"],
    priceTier: "very-budget",
    communityPriceTier: null,
    totalVotes: 0,
    latitude: 14.0,
    longitude: 121.0,
    googleMapsUrl: "",
    likes: 0,
    createdBy: "user1",
    isSeeded: true,
    createdAt: null,
    description: "A cool place",
  },
  {
    id: "place2",
    name: "Place B",
    categories: ["kape-inumin"],
    priceTier: "affordable",
    communityPriceTier: null,
    totalVotes: 0,
    latitude: 14.5,
    longitude: 121.0,
    googleMapsUrl: "",
    likes: 1,
    createdBy: "user1",
    isSeeded: true,
    createdAt: null,
    description: "Nice coffee",
  },
  {
    id: "place3",
    name: "Place C",
    categories: ["street-food"],
    priceTier: "moderate",
    communityPriceTier: null,
    totalVotes: 0,
    latitude: 15.0,
    longitude: 121.0,
    googleMapsUrl: "",
    likes: 2,
    createdBy: "user2",
    isSeeded: true,
    createdAt: null,
    description: "Street food corner",
  },
];

describe("randomizer_service - pickRandomPlace", () => {
  it("should return null when the list of places is empty", () => {
    const filters: RandomizerFilters = { priceTier: null, excludeTriedIds: [] };
    const result = pickRandomPlace([], filters);
    expect(result).toBeNull();
  });

  it("should return a place from the input list when no filters are set", () => {
    const filters: RandomizerFilters = { priceTier: null, excludeTriedIds: [] };
    const result = pickRandomPlace(mockPlaces, filters);
    expect(result).not.toBeNull();
    expect(mockPlaces).toContain(result);
  });

  it("should filter candidates by price tier correctly", () => {
    const filters: RandomizerFilters = { priceTier: "affordable", excludeTriedIds: [] };
    const result = pickRandomPlace(mockPlaces, filters);
    expect(result).not.toBeNull();
    expect(result?.id).toBe("place2");
  });

  it("should exclude tried places correctly", () => {
    const filters: RandomizerFilters = { priceTier: null, excludeTriedIds: ["place1", "place3"] };
    const result = pickRandomPlace(mockPlaces, filters);
    expect(result).not.toBeNull();
    expect(result?.id).toBe("place2");
  });

  it("should return null when all candidates are filtered out by combinations", () => {
    const filters: RandomizerFilters = { priceTier: "very-budget", excludeTriedIds: ["place1"] };
    const result = pickRandomPlace(mockPlaces, filters);
    expect(result).toBeNull();
  });

  it("should select different items over multiple runs to show randomness", () => {
    const filters: RandomizerFilters = { priceTier: null, excludeTriedIds: [] };
    const results = new Set<string>();

    for (let i = 0; i < 50; i++) {
      const place = pickRandomPlace(mockPlaces, filters);
      if (place) {
        results.add(place.id);
      }
    }

    // Since we ran it 50 times on 3 options, we expect to hit all 3 options.
    expect(results.size).toBe(3);
  });
});
