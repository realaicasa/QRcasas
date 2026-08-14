import { describe, it, expect } from "vitest";
import { linkId, linkTitle } from "@/lib/data/teable/client";

describe("Teable link helpers", () => {
  it("linkId extracts id from single object", () => {
    expect(linkId({ id: "recA", title: "X" })).toBe("recA");
    expect(linkId({ __id: "recB" })).toBe("recB");
  });

  it("linkId extracts id from array", () => {
    expect(linkId([{ id: "recA", title: "X" }])).toBe("recA");
    expect(linkId([{ __id: "recB" }])).toBe("recB");
  });

  it("linkId passes through plain strings and nulls", () => {
    expect(linkId("recA")).toBe("recA");
    expect(linkId(null)).toBeNull();
    expect(linkId(undefined)).toBeNull();
    expect(linkId([])).toBeNull();
  });

  it("linkTitle extracts title from object and array", () => {
    expect(linkTitle({ id: "recA", title: "T" })).toBe("T");
    expect(linkTitle([{ id: "recA", title: "T" }])).toBe("T");
    expect(linkTitle("recA")).toBe("recA");
    expect(linkTitle(null)).toBeNull();
  });
});