import { describe, expect, it } from "vitest";
import { canSharePrivateResponse, assertNeverExposePartnerPrivateData } from "@/lib/permissions";
import { isSensitiveField } from "@/lib/privacy/rules";

describe("privacy rules", () => {
  it("allows only the owner to share a private response", () => {
    expect(canSharePrivateResponse({ ownerId: "user-a", currentUserId: "user-a" })).toBe(true);
    expect(canSharePrivateResponse({ ownerId: "user-a", currentUserId: "user-b" })).toBe(false);
  });

  it("marks sensitive fields as sensitive", () => {
    expect(isSensitiveField("reflection")).toBe(true);
    expect(isSensitiveField("sos_session")).toBe(true);
    expect(isSensitiveField("journey_name")).toBe(false);
  });

  it("keeps the partner-private-data invariant explicit", () => {
    expect(assertNeverExposePartnerPrivateData()).toBe(true);
  });
});
