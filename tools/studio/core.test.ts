import { describe, expect, it } from "vitest";

import { createTravelCatalog } from "../../src/content/catalog";
import { siteCatalog } from "../../src/content/site-data";
import {
  buildStudioCatalog,
  isAllowedStudioHost,
  safeUploadName,
  sniffUploadType,
  type StudioInput,
} from "./core";

const updatedAt = "2026-11-12T17:00:00+13:00";

function completeDraft(): StudioInput {
  return {
    storyId: null,
    author: { mode: "existing" as const, id: "leonna-banzuela" },
    place: { mode: "existing" as const, id: "sandy-beach-auckland" },
    story: {
      title: "Return to Sandy Beach",
      summary: "A second dated visit saved as an independent draft.",
      bodyMarkdown: "This is a safe draft body.",
      visitDate: "2027-01-15",
      authorRating: 4.5,
      tags: ["beach" as const, "outdoor" as const],
      tips: [{ perspective: "subjective" as const, text: "Bring a towel." }],
      externalLinks: [
        {
          label: "Official information",
          url: "https://example.com/sandy-beach",
          kind: "official" as const,
        },
      ],
      media: [
        {
          source: "upload" as const,
          id: "media-photo-one",
          stagedName: "beach-photo-123456789abc.jpg",
          kind: "image" as const,
          altText: "Waves reaching the sandy shoreline.",
          caption: "The water on the return visit.",
          width: 1600,
          height: 1200,
        },
        {
          source: "upload" as const,
          id: "media-video-two",
          stagedName: "beach-video-abcdef123456.mp4",
          kind: "video" as const,
          altText: "A short view across the beach.",
          caption: "Looking out from the shore.",
        },
      ],
      coverMediaId: "media-photo-one",
    },
  };
}

describe("owner studio security boundary", () => {
  it("accepts only loopback Host headers", () => {
    expect(isAllowedStudioHost("127.0.0.1:4178", 4178)).toBe(true);
    expect(isAllowedStudioHost("localhost:4178", 4178)).toBe(true);
    expect(isAllowedStudioHost("travel.example:4178", 4178)).toBe(false);
    expect(isAllowedStudioHost("127.0.0.1:9999", 4178)).toBe(false);
  });

  it("detects media from magic bytes instead of its filename", () => {
    const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);
    expect(sniffUploadType(png)?.mimeType).toBe("image/png");
    expect(sniffUploadType(Buffer.from("not an image"))).toBeNull();
    expect(safeUploadName("../My Beach.JPG", png, ".png")).toMatch(
      /^my-beach-[a-f0-9]{12}\.png$/,
    );
  });
});

describe("owner studio draft persistence", () => {
  it("saves a canonical draft and preserves media order after reopening", () => {
    const catalog = buildStudioCatalog(siteCatalog, completeDraft(), updatedAt);
    const draft = catalog.stories.find(
      (story) => story.title === "Return to Sandy Beach",
    );

    expect(draft?.publicationStatus).toBe("draft");
    expect(draft?.visitDate).toBe("2027-01-15");
    expect(draft?.mediaIds).toEqual(["media-photo-one", "media-video-two"]);
    expect(draft?.coverMediaId).toBe("media-photo-one");

    const reopened = createTravelCatalog(JSON.parse(JSON.stringify(catalog)));
    expect(
      reopened.stories.find((story) => story.id === draft?.id)?.mediaIds,
    ).toEqual(["media-photo-one", "media-video-two"]);
  });

  it.each([
    ["invalid date", { story: { visitDate: "15-01-2027" } }],
    [
      "unsafe link",
      {
        story: {
          externalLinks: [
            { label: "Bad", url: "http://example.com", kind: "other" },
          ],
        },
      },
    ],
    [
      "unsafe Markdown",
      { story: { bodyMarkdown: "<script>alert(1)</script>" } },
    ],
    [
      "path traversal",
      {
        story: {
          media: [
            { ...completeDraft().story.media[0], stagedName: "../photo.jpg" },
          ],
        },
      },
    ],
  ])("rejects %s", (_label, patch) => {
    const input = completeDraft();
    Object.assign(input.story, patch.story);
    expect(() => buildStudioCatalog(siteCatalog, input, updatedAt)).toThrow();
  });

  it("rejects unverified coordinates outside the valid range", () => {
    const input = completeDraft();
    input.place = {
      mode: "new",
      name: "Test Place",
      areaId: "auckland",
      addressSummary: "Auckland",
      coordinates: { latitude: 120, longitude: 200 },
    };
    expect(() => buildStudioCatalog(siteCatalog, input, updatedAt)).toThrow(
      /Latitude/,
    );
  });
});
