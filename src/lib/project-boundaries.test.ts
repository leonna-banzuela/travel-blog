import { describe, expect, it } from "vitest";

import {
  isOwnerStudioPubliclyReachable,
  ownerStudioDirectory,
  publicMutationRoutesEnabled,
} from "./project-boundaries";

describe("public and owner-only project boundaries", () => {
  it("keeps the owner studio outside the public build directories", () => {
    expect(ownerStudioDirectory).toBe("tools/studio");
    expect(isOwnerStudioPubliclyReachable()).toBe(false);
  });

  it("starts with no public mutation routes", () => {
    expect(publicMutationRoutesEnabled).toBe(false);
  });
});
