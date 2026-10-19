import { describe, it, expect } from "vitest";
import { hasActiveAccess, computeBadges, ALL_LESSONS } from "./course";

describe("access", () => {
  it("no payment means no access", () => expect(hasActiveAccess(null)).toBe(false));
  it("expired quarter means no access", () =>
    expect(hasActiveAccess("2026-01-01T00:00:00Z", new Date("2026-05-01"))).toBe(false));
  it("active quarter grants access", () =>
    expect(hasActiveAccess("2026-06-01T00:00:00Z", new Date("2026-05-01"))).toBe(true));
});

describe("badges", () => {
  it("completing everything earns Productor IA", () => {
    const b = computeBadges(new Set(ALL_LESSONS.map((l) => l.id)));
    expect(b.find((x) => x.id === "pro")!.earned).toBe(true);
  });
});
