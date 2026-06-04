/**
 * @jest-environment node
 */
import {
  hasRole,
  isAdmin,
  AppRole,
  requireAdminOr403,
} from "./authz";
import { auth0 } from "@/lib/auth0";

const ROLES_CLAIM = "https://e-commerce.com/roles";

jest.mock("@/lib/auth0", () => ({
  auth0: {
    getSession: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

function userWithRoles(roles: AppRole[]) {
  return {
    sub: "auth0|123",
    name: "Test User",
    [ROLES_CLAIM]: roles,
  };
}

describe("Authz Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("hasRole & isAdmin", () => {
    it("returns true if the user has a role", () => {
      const adminUser = userWithRoles([AppRole.ADMIN]);
      expect(hasRole(adminUser, AppRole.ADMIN)).toBe(true);
      expect(isAdmin(adminUser)).toBe(true);
    });

    it("returns false if the user is missing a role", () => {
      const normalUser = userWithRoles([AppRole.USER]);
      expect(hasRole(normalUser, AppRole.ADMIN)).toBe(false);
      expect(isAdmin(normalUser)).toBe(false);
    });

    it("returns false if the user is null", () => {
      expect(hasRole(null, AppRole.USER)).toBe(false);
      expect(isAdmin(null)).toBe(false);
    });
  });

  describe("API Route Protections (requireAdminOr403)", () => {
    it("returns 403 Forbidden if user is logged in but NOT an admin", async () => {
      const normalUser = userWithRoles([AppRole.USER]);
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: normalUser });

      const result = await requireAdminOr403();

      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(403);
    });

    it("returns the user object if user is an admin", async () => {
      const adminUser = userWithRoles([AppRole.ADMIN]);
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: adminUser });

      const result = await requireAdminOr403();

      expect(result).toEqual(adminUser);
    });
  });
});