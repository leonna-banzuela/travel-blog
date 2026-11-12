import { describe, expect, it } from "vitest";

import { createTravelCatalog } from "./catalog";
import {
  formatVisitDate,
  moreAtPlace,
  moreInArea,
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
    expect(view.place.coordinates).toEqual({
      latitude: -36.975,
      longitude: 174.62,
    });
    expect(view.story.bodyMarkdown).toBe(
      "Sandy Beach was a lovely place to slow down and enjoy the Auckland coast. The water looked so inviting that I really wanted to go for a swim. Unfortunately, I had not brought my swimsuit, so I could not get in. I still had a nice time taking in the view and would happily return better prepared.",
    );
    expect(
      splitStoryParagraphs(view.story.bodyMarkdown)[0].split(". "),
    ).toHaveLength(4);
    expect(view.media.map((item) => item.kind)).toEqual([
      "image",
      "image",
      "video",
    ]);
    expect(view.story.coverMediaId).toBe("sandy-beach-pohutukawa");
    expect(view.media[0]?.variants).toHaveLength(4);
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

  it("derives related reading from place and area relationships", () => {
    const firstStory = siteCatalog.stories[0];
    const repeatedVisit = {
      ...firstStory,
      id: "sandy-beach-2027-01-15-leonna-banzuela",
      slug: "sandy-beach-2027-01-15-leonna-banzuela",
      title: "Back at Sandy Beach",
      visitDate: "2027-01-15",
    };
    const neighbouringPlace = {
      ...siteCatalog.places[0],
      id: "neighbouring-beach-auckland",
      slug: "neighbouring-beach-auckland",
      name: "Neighbouring Beach",
    };
    const neighbouringStory = {
      ...firstStory,
      id: "neighbouring-beach-2027-02-01-leonna-banzuela",
      slug: "neighbouring-beach-2027-02-01-leonna-banzuela",
      placeId: neighbouringPlace.id,
      title: "A nearby Auckland visit",
      visitDate: "2027-02-01",
    };
    const catalog = createTravelCatalog({
      ...siteCatalog,
      places: [...siteCatalog.places, neighbouringPlace],
      stories: [...siteCatalog.stories, repeatedVisit, neighbouringStory],
    });

    expect(
      moreAtPlace(catalog, firstStory).map(({ story }) => story.id),
    ).toEqual([repeatedVisit.id]);
    expect(
      moreInArea(catalog, firstStory).map(({ story }) => story.id),
    ).toEqual([neighbouringStory.id]);
  });
});
