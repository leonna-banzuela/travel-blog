import * as z from "zod";

import {
  authorSchema,
  geographicAreaSchema,
  mediaSchema,
  placeSchema,
  storySchema,
  type Author,
  type GeographicArea,
  type Media,
  type Place,
  type Story,
} from "./schemas";
import type { ControlledTag } from "./tags";

function addDuplicateIssues(
  values: readonly { id: string; slug?: string }[],
  collectionName: string,
  context: z.RefinementCtx,
): void {
  const idIndexes = new Map<string, number>();
  const slugIndexes = new Map<string, number>();

  values.forEach((value, index) => {
    const previousIdIndex = idIndexes.get(value.id);
    if (previousIdIndex !== undefined) {
      context.addIssue({
        code: "custom",
        path: [collectionName, index, "id"],
        message: `Duplicate ID "${value.id}"; it is already used at ${collectionName}[${previousIdIndex}].`,
      });
    } else {
      idIndexes.set(value.id, index);
    }

    if (value.slug) {
      const previousSlugIndex = slugIndexes.get(value.slug);
      if (previousSlugIndex !== undefined) {
        context.addIssue({
          code: "custom",
          path: [collectionName, index, "slug"],
          message: `Duplicate slug "${value.slug}"; it is already used at ${collectionName}[${previousSlugIndex}].`,
        });
      } else {
        slugIndexes.set(value.slug, index);
      }
    }
  });
}

export const travelCatalogSchema = z
  .object({
    areas: z.array(geographicAreaSchema),
    authors: z.array(authorSchema),
    places: z.array(placeSchema),
    media: z.array(mediaSchema),
    stories: z.array(storySchema),
  })
  .strict()
  .superRefine((catalog, context) => {
    addDuplicateIssues(catalog.areas, "areas", context);
    addDuplicateIssues(catalog.authors, "authors", context);
    addDuplicateIssues(catalog.places, "places", context);
    addDuplicateIssues(catalog.media, "media", context);
    addDuplicateIssues(catalog.stories, "stories", context);

    const areaIds = new Set(catalog.areas.map((area) => area.id));
    const areaParents = new Map(
      catalog.areas.map((area) => [area.id, area.parentAreaId]),
    );
    const authorIds = new Set(catalog.authors.map((author) => author.id));
    const placeIds = new Set(catalog.places.map((place) => place.id));
    const mediaIds = new Set(catalog.media.map((item) => item.id));

    catalog.areas.forEach((area, index) => {
      if (area.parentAreaId !== null && !areaIds.has(area.parentAreaId)) {
        context.addIssue({
          code: "custom",
          path: ["areas", index, "parentAreaId"],
          message: `Area "${area.id}" references missing parent "${area.parentAreaId}".`,
        });
      }

      const visited = new Set<string>();
      let currentAreaId: string | null = area.id;
      while (currentAreaId !== null) {
        if (visited.has(currentAreaId)) {
          context.addIssue({
            code: "custom",
            path: ["areas", index, "parentAreaId"],
            message: `Area "${area.id}" is part of a parent cycle.`,
          });
          break;
        }
        visited.add(currentAreaId);
        currentAreaId = areaParents.get(currentAreaId) ?? null;
      }
    });

    catalog.places.forEach((place, index) => {
      if (!areaIds.has(place.areaId)) {
        context.addIssue({
          code: "custom",
          path: ["places", index, "areaId"],
          message: `Place "${place.id}" references missing area "${place.areaId}".`,
        });
      }
    });

    catalog.stories.forEach((story, storyIndex) => {
      if (!placeIds.has(story.placeId)) {
        context.addIssue({
          code: "custom",
          path: ["stories", storyIndex, "placeId"],
          message: `Story "${story.id}" references missing place "${story.placeId}".`,
        });
      }

      if (!authorIds.has(story.authorId)) {
        context.addIssue({
          code: "custom",
          path: ["stories", storyIndex, "authorId"],
          message: `Story "${story.id}" references missing author "${story.authorId}".`,
        });
      }

      story.mediaIds.forEach((mediaId, mediaIndex) => {
        if (!mediaIds.has(mediaId)) {
          context.addIssue({
            code: "custom",
            path: ["stories", storyIndex, "mediaIds", mediaIndex],
            message: `Story "${story.id}" references missing media "${mediaId}".`,
          });
        }
      });
    });
  });

export type TravelCatalog = {
  areas: GeographicArea[];
  authors: Author[];
  places: Place[];
  media: Media[];
  stories: Story[];
};

export type StoryFilters = {
  placeId?: string;
  areaId?: string;
  authorId?: string;
  visitDate?: string;
  tags?: readonly ControlledTag[];
};

export function createTravelCatalog(input: unknown): TravelCatalog {
  return travelCatalogSchema.parse(input);
}

export function formatCatalogIssues(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "catalog";
    return `${path}: ${issue.message}`;
  });
}

export function buildStorySlug(
  placeSlug: string,
  visitDate: string,
  authorSlug: string,
  discriminator?: string,
): string {
  const suffix = discriminator ? `-${discriminator}` : "";
  return `${placeSlug}-${visitDate}-${authorSlug}${suffix}`;
}

function collectDescendantAreaIds(
  catalog: TravelCatalog,
  areaId: string,
): Set<string> {
  const areaIds = new Set<string>([areaId]);
  let changed = true;

  while (changed) {
    changed = false;
    for (const area of catalog.areas) {
      if (
        area.parentAreaId &&
        areaIds.has(area.parentAreaId) &&
        !areaIds.has(area.id)
      ) {
        areaIds.add(area.id);
        changed = true;
      }
    }
  }

  return areaIds;
}

export function findStories(
  catalog: TravelCatalog,
  filters: StoryFilters = {},
): Story[] {
  const areaIds = filters.areaId
    ? collectDescendantAreaIds(catalog, filters.areaId)
    : null;
  const placeIds = areaIds
    ? new Set(
        catalog.places
          .filter((place) => areaIds.has(place.areaId))
          .map((place) => place.id),
      )
    : null;

  return catalog.stories
    .filter((story) => !filters.placeId || story.placeId === filters.placeId)
    .filter((story) => !placeIds || placeIds.has(story.placeId))
    .filter((story) => !filters.authorId || story.authorId === filters.authorId)
    .filter(
      (story) => !filters.visitDate || story.visitDate === filters.visitDate,
    )
    .filter(
      (story) =>
        !filters.tags ||
        filters.tags.every((requiredTag) => story.tags.includes(requiredTag)),
    )
    .toSorted((left, right) => right.visitDate.localeCompare(left.visitDate));
}
