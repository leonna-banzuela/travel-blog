import { describe, expect, it } from "vitest";

import { createTravelCatalog } from "./catalog";
import {
  formatVisitDate,
  publishedStories,
  splitStoryParagraphs,
  storyViews,
} from "./public-content";
import { siteCatalog } from "./site-data";

describe("public reading content", () => {
  it("resolves the first published story and its direct route data", () => {
    const [view] = storyViews(siteCatalog);

    expect(view.story.slug).toBe("sandy-beach-2026-11-01-leonna-banzuela");
    expect(view.place.name).toBe("Sandy Beach");
    expect(view.author.name).toBe("Leonna Banzuela");
    expect(formatVisitDate(view.story.visitDate)).toBe("1 November 2026");
    expect(
      splitStoryParagraphs(view.story.bodyMarkdown)[0].split(". "),
    ).toHaveLength(4);
  });

  it("keeps repeat visits as separate published reading entries", () => {
    const firstStory = siteCatalog.stories[0];
    const repeatedVisit = {
      ...firstStory,
      id: "sandy-beach-2027-01-15-leonna-banzuela",
      slug: "sandy-beach-2027-01-15-leonna-banzuela",
      visitDate: "2027-01-15",
    };
    const catalog = createTravelCatalog({
      ...siteCatalog,
      stories: [...siteCatalog.stories, repeatedVisit],
    });

    expect(publishedStories(catalog).map((story) => story.visitDate)).toEqual([
      "2027-01-15",
      "2026-11-01",
    ]);
  });
});
