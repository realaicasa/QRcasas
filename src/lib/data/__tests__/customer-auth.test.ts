import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCustomerAuth } from "@/lib/customer-auth";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/data/users", () => ({
  getUserByEmail: vi.fn(),
}));

import { cookies } from "next/headers";
import { getUserByEmail } from "@/lib/data/users";

const mockCookies = vi.mocked(cookies);
const mockGetUserByEmail = vi.mocked(getUserByEmail);

describe("Customer Auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null when no session cookie", async () => {
    mockCookies.mockReturnValue({
      get: () => undefined,
    } as any);

    const session = await getCustomerAuth();
    expect(session).toBeNull();
  });

  it("should return user object when cookie exists", async () => {
    mockCookies.mockReturnValue({
      get: () => ({ value: "test@example.com" }),
    } as any);

    mockGetUserByEmail.mockResolvedValue({
      userId: "user-123",
      email: "test@example.com",
      preferredLanguage: "en",
      isVerified: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    });

    const session = await getCustomerAuth();
    expect(session).toEqual({
      userId: "user-123",
      email: "test@example.com",
      preferredLanguage: "en",
    });
  });

  it("should return null when user not found", async () => {
    mockCookies.mockReturnValue({
      get: () => ({ value: "unknown@example.com" }),
    } as any);

    mockGetUserByEmail.mockResolvedValue(null);

    const session = await getCustomerAuth();
    expect(session).toBeNull();
  });
});
