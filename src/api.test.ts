import { describeWeatherCode } from "./api";

describe("describeWeatherCode", () => {
  it("returns known labels for known weather codes", () => {
    expect(describeWeatherCode(0)).toBe("Clear sky");
    expect(describeWeatherCode(63)).toBe("Rain");
  });

  it("returns fallback for unknown weather code", () => {
    expect(describeWeatherCode(999)).toBe("Unknown conditions");
  });
});
