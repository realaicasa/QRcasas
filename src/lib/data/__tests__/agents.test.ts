import { describe, it, expect } from "vitest";
import { getAllAgents, getAgentById, updateAgentProfile } from "../agents";

describe("Agents", () => {
  it("should have getAllAgents function", async () => {
    expect(typeof getAllAgents).toBe("function");
  });

  it("should have getAgentById function", async () => {
    expect(typeof getAgentById).toBe("function");
  });

  it("should have updateAgentProfile function", async () => {
    expect(typeof updateAgentProfile).toBe("function");
  });
});
