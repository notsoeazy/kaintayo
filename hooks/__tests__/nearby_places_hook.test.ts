import React from "react";
import { filterPlaces, useNearbyPlaces } from "../nearby_places_hook";
import type { Place, FeedFilters } from "@/types";
import type { LocationObject } from "expo-location";

// MOCKS
jest.mock("@/lib/geo_utils", () => ({
  haversineKm: (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Simple mock: absolute difference of latitudes as distance
    return Math.abs(lat1 - lat2);
  },
}));

// MOCK DATA
const mockPlaces: Place[] = [
  {
    id: "place1",
    name: "Place A",
    categories: ["silog", "street-food"],
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
    communityPriceTier: "moderate",
    totalVotes: 5, // Has consensus
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
    communityPriceTier: "very-budget",
    totalVotes: 0, // No consensus, should use base priceTier (moderate)
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

describe("nearby_places_hook - filterPlaces", () => {
  it("should calculate distance and sort by distance when user location is provided", () => {
    const filters: FeedFilters = { categories: [], priceTier: null, maxDistance: null };
    const userLoc = { latitude: 14.2, longitude: 121.0 };

    const results = filterPlaces(mockPlaces, filters, userLoc);

    expect(results).toHaveLength(3);
    // place1: |14.2 - 14.0| = 0.2
    // place2: |14.2 - 14.5| = 0.3
    // place3: |14.2 - 15.0| = 0.8
    expect(results[0].id).toBe("place1");
    expect(results[0].distance).toBeCloseTo(0.2);
    expect(results[1].id).toBe("place2");
    expect(results[1].distance).toBeCloseTo(0.3);
    expect(results[2].id).toBe("place3");
    expect(results[2].distance).toBeCloseTo(0.8);
  });

  it("should filter by max distance if specified", () => {
    const filters: FeedFilters = { categories: [], priceTier: null, maxDistance: 0.25 };
    const userLoc = { latitude: 14.2, longitude: 121.0 };

    const results = filterPlaces(mockPlaces, filters, userLoc);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("place1");
  });

  it("should filter by categories if specified", () => {
    const filters: FeedFilters = { categories: ["street-food"], priceTier: null, maxDistance: null };
    const userLoc = null;

    const results = filterPlaces(mockPlaces, filters, userLoc);

    expect(results).toHaveLength(2);
    expect(results.map(r => r.id)).toContain("place1");
    expect(results.map(r => r.id)).toContain("place3");
  });

  it("should filter by price tier considering community consensus", () => {
    const filters: FeedFilters = { categories: [], priceTier: "moderate", maxDistance: null };
    const userLoc = null;

    const results = filterPlaces(mockPlaces, filters, userLoc);

    expect(results).toHaveLength(2);
    expect(results.map(r => r.id)).toContain("place2");
    expect(results.map(r => r.id)).toContain("place3");
  });

  it("should filter by price tier using base tier if no consensus", () => {
    const filters: FeedFilters = { categories: [], priceTier: "very-budget", maxDistance: null };
    const userLoc = null;

    const results = filterPlaces(mockPlaces, filters, userLoc);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("place1");
  });
});

describe("useNearbyPlaces Hook", () => {
  it("should wrap filterPlaces in useMemo", () => {
    const useMemoSpy = jest.spyOn(React, "useMemo").mockImplementation((fn) => fn());
    const filters: FeedFilters = { categories: [], priceTier: null, maxDistance: null };
    const userLocation: LocationObject = {
      coords: {
        latitude: 14.2,
        longitude: 121.0,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    const res = useNearbyPlaces(mockPlaces, filters, userLocation);

    expect(res).toHaveLength(3);
    expect(res[0].id).toBe("place1");
    expect(useMemoSpy).toHaveBeenCalled();
    useMemoSpy.mockRestore();
  });
});
