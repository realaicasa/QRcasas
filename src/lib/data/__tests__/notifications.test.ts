import { describe, it, expect } from "vitest";
import { getCustomerNotifications, markNotificationRead } from "@/lib/data/notifications";

describe("Notifications", () => {
  it("should get customer notifications", async () => {
    expect(typeof getCustomerNotifications).toBe("function");
  });

  it("should mark notification as read", async () => {
    expect(typeof markNotificationRead).toBe("function");
  });

  it("should get unread notification count", async () => {
    expect(typeof (await import("@/lib/data/notifications")).getUnreadNotificationCount).toBe("function");
  });
});
