import { findStories, type TravelCatalog } from "./catalog";
import type { Author, GeographicArea, Media, Place, Story } from "./schemas";

export type StoryView = {
  story: Story;
  place: Place;
  author: Author;
  area: GeographicArea;
  media: Media[];
};

export function publishedStories(catalog: TravelCatalog): Story[] {
  return findStories(catalog).filter(
    (story) => story.publicationStatus === "published",
  );
}

export function resolveStoryView(
  catalog: TravelCatalog,
  story: Story,
): StoryView {
  const place = catalog.places.find((item) => item.id === story.placeId);
  const author = catalog.authors.find((item) => item.id === story.authorId);

  if (!place || !author) {
    throw new Error(`Validated story "${story.id}" has unresolved relations.`);
  }

  const area = catalog.areas.find((item) => item.id === place.areaId);
  if (!area) {
    throw new Error(`Validated place "${place.id}" has no area.`);
  }

  const mediaById = new Map(catalog.media.map((item) => [item.id, item]));
  return {
    story,
    place,
    author,
    area,
    media: story.mediaIds.map((mediaId) => {
      const item = mediaById.get(mediaId);
      if (!item) {
        throw new Error(`Validated story "${story.id}" has missing media.`);
      }
      return item;
    }),
  };
}

export function storyViews(catalog: TravelCatalog): StoryView[] {
  return publishedStories(catalog).map((story) =>
    resolveStoryView(catalog, story),
  );
}

export function formatVisitDate(value: string): string {
  return new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function splitStoryParagraphs(markdown: string): string[] {
  return markdown
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function toSafeEmbedUrl(src: string): string {
  const url = new URL(src);
  const host = url.hostname.toLowerCase();

  if (host === "youtu.be") {
    return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
  }
  if (host === "youtube.com" || host === "www.youtube.com") {
    if (url.pathname === "/watch") {
      return `https://www.youtube.com/embed/${url.searchParams.get("v") ?? ""}`;
    }
    if (url.pathname.startsWith("/shorts/")) {
      return `https://www.youtube.com/embed/${url.pathname.split("/")[2] ?? ""}`;
    }
  }
  if (host === "vimeo.com") {
    return `https://player.vimeo.com/video/${url.pathname.slice(1)}`;
  }
  return src;
}
