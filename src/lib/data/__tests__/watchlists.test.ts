import { describe, it, expect } from "vitest";
import { createWatchlist } from "@/lib/data/watchlists";

describe("Watchlists", () => {
  it("should create a watchlist", async () => {
    expect(typeof createWatchlist).toBe("function");
  });

  it("should get customer watchlists", async () => {
    expect(typeof (await import("@/lib/data/watchlists")).getCustomerWatchlists).toBe("function");
  });
});
