import { describe, expect, it } from "vitest";

import {
  buildStorySlug,
  createTravelCatalog,
  findStories,
  formatCatalogIssues,
  travelCatalogSchema,
  type TravelCatalog,
} from "./catalog";

const timestamp = "2026-11-01T05:00:00Z";

function makeCatalog(): TravelCatalog {
  return createTravelCatalog({
    areas: [
      {
        id: "world",
        slug: "world",
        name: "World",
        kind: "world",
        parentAreaId: null,
        updatedAt: timestamp,
      },
      {
        id: "new-zealand",
        slug: "new-zealand",
        name: "New Zealand",
        kind: "country",
        parentAreaId: "world",
        countryCode: "NZ",
        updatedAt: timestamp,
      },
      {
        id: "example-region",
        slug: "example-region",
        name: "Example Region",
        kind: "region",
        parentAreaId: "new-zealand",
        countryCode: "NZ",
        updatedAt: timestamp,
      },
      {
        id: "example-locality",
        slug: "example-locality",
        name: "Example Locality",
        kind: "locality",
        parentAreaId: "example-region",
        countryCode: "NZ",
        updatedAt: timestamp,
      },
    ],
    authors: [
      {
        id: "leonna-banzuela",
        slug: "leonna-banzuela",
        name: "Leonna Banzuela",
        socialLinks: [],
        updatedAt: timestamp,
      },
      {
        id: "guest-creator",
        slug: "guest-creator",
        name: "Guest Creator",
        socialLinks: [],
        updatedAt: timestamp,
      },
    ],
    places: [
      {
        id: "example-place",
        slug: "example-place",
        name: "Example Place",
        areaId: "example-locality",
        coordinates: null,
        updatedAt: timestamp,
      },
    ],
    media: [
      {
        id: "example-photo",
        kind: "image",
        src: "/media/example/photo.webp",
        altText: "A fictional example used only for schema tests.",
        width: 1_200,
        height: 800,
        updatedAt: timestamp,
      },
    ],
    stories: [
      {
        id: "leonna-example-early",
        slug: "example-place-2026-01-01-leonna-banzuela",
        placeId: "example-place",
        authorId: "leonna-banzuela",
        title: "An early example visit",
        summary:
          "A fictional visit used to prove that repeat dates remain separate.",
        bodyMarkdown: "This is safe Markdown for a fictional schema fixture.",
        visitDate: "2026-01-01",
        authorRating: 4,
        tips: [
          {
            id: "early-observation",
            perspective: "observed",
            text: "This note records something directly observed during the fictional visit.",
          },
        ],
        externalLinks: [],
        mediaIds: ["example-photo"],
        tags: ["nature", "relaxing"],
        publicationStatus: "published",
        publishedAt: "2026-01-02T00:00:00Z",
        updatedAt: timestamp,
      },
      {
        id: "leonna-example-later",
        slug: "example-place-2026-11-01-leonna-banzuela",
        placeId: "example-place",
        authorId: "leonna-banzuela",
        title: "A later example visit",
        summary:
          "A second fictional visit to the same place on a different date.",
        bodyMarkdown:
          "A separate story preserves the perspective from this later visit.",
        visitDate: "2026-11-01",
        authorRating: 4.5,
        tips: [
          {
            id: "later-impression",
            perspective: "subjective",
            text: "This note is explicitly a personal impression.",
          },
        ],
        externalLinks: [],
        mediaIds: [],
        tags: ["nature", "outdoor"],
        publicationStatus: "published",
        publishedAt: "2026-11-02T00:00:00Z",
        updatedAt: timestamp,
      },
      {
        id: "guest-example-visit",
        slug: "example-place-2026-06-15-guest-creator",
        placeId: "example-place",
        authorId: "guest-creator",
        title: "A guest example visit",
        summary: "A fictional guest perspective at the shared place.",
        bodyMarkdown:
          "Places and stories remain separate so creators can share one map location.",
        visitDate: "2026-06-15",
        authorRating: 3.5,
        tips: [],
        externalLinks: [],
        mediaIds: [],
        tags: ["nature", "budget-friendly"],
        publicationStatus: "review",
        publishedAt: null,
        updatedAt: timestamp,
      },
    ],
  });
}

describe("travel catalog relationships and discovery", () => {
  it("supports repeated dated visits and multiple creators at one place", () => {
    const catalog = makeCatalog();
    const stories = findStories(catalog, { placeId: "example-place" });

    expect(stories).toHaveLength(3);
    expect(stories.map((story) => story.visitDate)).toEqual([
      "2026-11-01",
      "2026-06-15",
      "2026-01-01",
    ]);
    expect(new Set(stories.map((story) => story.authorId))).toEqual(
      new Set(["leonna-banzuela", "guest-creator"]),
    );
  });

  it("resolves stories by descendant area, author, date, and combined tags", () => {
    const catalog = makeCatalog();

    expect(findStories(catalog, { areaId: "example-region" })).toHaveLength(3);
    expect(findStories(catalog, { authorId: "guest-creator" })).toHaveLength(1);
    expect(findStories(catalog, { visitDate: "2026-01-01" })).toHaveLength(1);
    expect(findStories(catalog, { tags: ["nature", "outdoor"] })[0]?.id).toBe(
      "leonna-example-later",
    );
  });

  it("builds date-aware, author-aware story slugs", () => {
    expect(
      buildStorySlug("example-place", "2026-11-01", "leonna-banzuela"),
    ).toBe("example-place-2026-11-01-leonna-banzuela");
    expect(
      buildStorySlug(
        "example-place",
        "2026-11-01",
        "leonna-banzuela",
        "second",
      ),
    ).toBe("example-place-2026-11-01-leonna-banzuela-second");
  });
});

describe("travel catalog validation", () => {
  it("rejects invalid dates with an actionable path", () => {
    const catalog = structuredClone(makeCatalog());
    catalog.stories[0]!.visitDate = "2026-02-30";
    const result = travelCatalogSchema.safeParse(catalog);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(formatCatalogIssues(result.error).join("\n")).toMatch(
        /stories\.0\.visitDate/i,
      );
    }
  });

  it("rejects insecure external URLs", () => {
    const catalog = structuredClone(makeCatalog());
    catalog.stories[0]!.externalLinks = [
      { label: "Unsafe link", url: "http://example.com", kind: "other" },
    ];

    expect(travelCatalogSchema.safeParse(catalog).success).toBe(false);
  });

  it("rejects unsafe media paths and unapproved embed hosts", () => {
    const catalog = structuredClone(makeCatalog());
    catalog.media[0]!.src = "/media/../secret.jpg";
    expect(travelCatalogSchema.safeParse(catalog).success).toBe(false);

    catalog.media[0] = {
      id: "example-video",
      kind: "video-embed",
      src: "https://untrusted.example/video/1",
      altText: "A fictional video.",
      updatedAt: timestamp,
    };
    expect(travelCatalogSchema.safeParse(catalog).success).toBe(false);
  });

  it("rejects out-of-range coordinates", () => {
    const catalog = structuredClone(makeCatalog());
    catalog.places[0]!.coordinates = { latitude: -91, longitude: 181 };

    expect(travelCatalogSchema.safeParse(catalog).success).toBe(false);
  });

  it("rejects raw HTML and script URLs in story Markdown", () => {
    const catalog = structuredClone(makeCatalog());
    catalog.stories[0]!.bodyMarkdown =
      '<script src="https://example.com/evil.js"></script>';
    expect(travelCatalogSchema.safeParse(catalog).success).toBe(false);

    catalog.stories[0]!.bodyMarkdown = "[bad](javascript:alert(1))";
    expect(travelCatalogSchema.safeParse(catalog).success).toBe(false);
  });

  it("rejects duplicate IDs and slugs", () => {
    const catalog = structuredClone(makeCatalog());
    catalog.authors.push({ ...catalog.authors[0]! });
    const result = travelCatalogSchema.safeParse(catalog);

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = formatCatalogIssues(result.error).join("\n");
      expect(messages).toContain("Duplicate ID");
      expect(messages).toContain("Duplicate slug");
    }
  });

  it("rejects missing place, author, area, media, and parent relations", () => {
    const catalog = structuredClone(makeCatalog());
    catalog.areas[2]!.parentAreaId = "missing-parent";
    catalog.places[0]!.areaId = "missing-area";
    catalog.stories[0]!.placeId = "missing-place";
    catalog.stories[0]!.authorId = "missing-author";
    catalog.stories[0]!.mediaIds = ["missing-media"];
    const result = travelCatalogSchema.safeParse(catalog);

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = formatCatalogIssues(result.error).join("\n");
      expect(messages).toMatch(/missing parent/i);
      expect(messages).toMatch(/missing area/i);
      expect(messages).toMatch(/missing place/i);
      expect(messages).toMatch(/missing author/i);
      expect(messages).toMatch(/missing media/i);
    }
  });

  it("rejects geographic parent cycles", () => {
    const catalog = structuredClone(makeCatalog());
    catalog.areas[1]!.parentAreaId = "example-region";
    const result = travelCatalogSchema.safeParse(catalog);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(formatCatalogIssues(result.error).join("\n")).toMatch(
        /parent cycle/i,
      );
    }
  });

  it("requires publication dates only for published stories", () => {
    const missingPublishedAt = structuredClone(makeCatalog());
    missingPublishedAt.stories[0]!.publishedAt = null;
    expect(travelCatalogSchema.safeParse(missingPublishedAt).success).toBe(
      false,
    );

    const prematurePublishedAt = structuredClone(makeCatalog());
    prematurePublishedAt.stories[2]!.publishedAt = timestamp;
    expect(travelCatalogSchema.safeParse(prematurePublishedAt).success).toBe(
      false,
    );
  });
});
