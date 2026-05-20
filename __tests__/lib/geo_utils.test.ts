import { haversineKm } from '@/lib/geo_utils';

describe('geo_utils - haversineKm', () => {
  it('returns 0 for identical coordinates', () => {
    const result = haversineKm(14.5995, 120.9842, 14.5995, 120.9842);
    expect(result).toBe(0);
  });

  it('returns the correct approximate distance between Manila and Makati', () => {
    // Manila City Hall: ~14.5942, 120.9800
    // Makati City Hall: ~14.5547, 121.0244
    const result = haversineKm(14.5942, 120.9800, 14.5547, 121.0244);
    // Real-world distance is ~6 km — allow ±2 km tolerance
    expect(result).toBeGreaterThan(4);
    expect(result).toBeLessThan(8);
  });

  it('is symmetric — distance A to B equals distance B to A', () => {
    const ab = haversineKm(14.5995, 120.9842, 13.6217, 123.1948);
    const ba = haversineKm(13.6217, 123.1948, 14.5995, 120.9842);
    expect(ab).toBeCloseTo(ba, 5);
  });

  it('returns a positive value for any two different coordinates', () => {
    const result = haversineKm(0, 0, 1, 1);
    expect(result).toBeGreaterThan(0);
  });

  it('returns a larger distance for points farther apart', () => {
    const nearDistance = haversineKm(14.5995, 120.9842, 14.6000, 120.9850);
    const farDistance = haversineKm(14.5995, 120.9842, 13.6217, 123.1948);
    expect(farDistance).toBeGreaterThan(nearDistance);
  });
});
