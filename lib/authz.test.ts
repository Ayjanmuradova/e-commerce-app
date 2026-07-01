/**
 * @jest-environment node
 */
import {
  hasRole,
  isAdmin,
  AppRole,
  requireAdminOr403,
  getSessionUser,
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

function createMockIdToken(roles: string[]): string {
  const payload = Buffer.from(
    JSON.stringify({ [ROLES_CLAIM]: roles }),
  ).toString("base64");
  return `header.${payload}.signature`;
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

  describe("getSessionUser", () => {
    it("returns null when there is no session", async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue(null);

      const user = await getSessionUser();

      expect(user).toBeNull();
    });

    it("returns user with roles from session user object", async () => {
      const adminUser = userWithRoles([AppRole.ADMIN]);
      (auth0.getSession as jest.Mock).mockResolvedValue({ user: adminUser });

      const user = await getSessionUser();

      expect(user).toEqual(adminUser);
      expect(isAdmin(user)).toBe(true);
    });

    it("falls back to roles from idToken when user object has no roles claim", async () => {
      const userWithoutRoles = { sub: "auth0|456", name: "Token User" };
      const idToken = createMockIdToken([AppRole.ADMIN]);

      (auth0.getSession as jest.Mock).mockResolvedValue({
        user: userWithoutRoles,
        tokenSet: { idToken },
      });

      const user = await getSessionUser();

      expect(user?.[ROLES_CLAIM]).toEqual([AppRole.ADMIN]);
      expect(isAdmin(user)).toBe(true);
    });

    it("keeps session user roles when roles claim is already on user object", async () => {
      const userWithUserRole = userWithRoles([AppRole.USER]);
      const idToken = createMockIdToken([AppRole.ADMIN]);

      (auth0.getSession as jest.Mock).mockResolvedValue({
        user: userWithUserRole,
        tokenSet: { idToken },
      });

      const user = await getSessionUser();

      expect(user?.[ROLES_CLAIM]).toEqual([AppRole.USER]);
      expect(isAdmin(user)).toBe(false);
    });
  });

  describe("API Route Protections (requireAdminOr403)", () => {
    it("returns 401 Unauthorized when user is not logged in", async () => {
      (auth0.getSession as jest.Mock).mockResolvedValue(null);

      const result = await requireAdminOr403();

      expect(result).toBeInstanceOf(Response);
      expect((result as Response).status).toBe(401);
    });

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
