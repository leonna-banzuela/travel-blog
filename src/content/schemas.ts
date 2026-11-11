import * as z from "zod";

import { controlledTagValues } from "./tags";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const safeLocalMediaSegment = /^[A-Za-z0-9._-]+$/;

export const recordIdSchema = z
  .string({ error: "ID is required." })
  .min(3, { error: "ID must contain at least 3 characters." })
  .max(100, { error: "ID must contain at most 100 characters." })
  .regex(slugPattern, {
    error: "ID must use lowercase letters, numbers, and single hyphens.",
  });

export const slugSchema = z
  .string({ error: "Slug is required." })
  .min(3, { error: "Slug must contain at least 3 characters." })
  .max(120, { error: "Slug must contain at most 120 characters." })
  .regex(slugPattern, {
    error: "Slug must use lowercase letters, numbers, and single hyphens.",
  });

const plainTextSchema = z
  .string()
  .trim()
  .min(1, { error: "Text cannot be empty." })
  .max(500, { error: "Text must contain at most 500 characters." })
  .refine((value) => !/[<>]/.test(value), {
    error: "Plain-text fields cannot contain HTML brackets.",
  });

export const secureUrlSchema = z
  .url({ error: "Enter a valid absolute URL." })
  .refine(
    (value) => {
      try {
        return new URL(value).protocol === "https:";
      } catch {
        return false;
      }
    },
    {
      error: "External URLs must use HTTPS.",
    },
  );

export const isoDateSchema = z.iso.date({
  error: "Use a real ISO date in YYYY-MM-DD format.",
});
export const isoDateTimeSchema = z.iso.datetime({
  offset: true,
  error: "Use an ISO date-time with a timezone.",
});

export const coordinatesSchema = z
  .object({
    latitude: z
      .number()
      .min(-90, { error: "Latitude cannot be below -90." })
      .max(90, {
        error: "Latitude cannot be above 90.",
      }),
    longitude: z
      .number()
      .min(-180, { error: "Longitude cannot be below -180." })
      .max(180, {
        error: "Longitude cannot be above 180.",
      }),
  })
  .strict();

export const areaKindSchema = z.enum([
  "world",
  "country",
  "region",
  "locality",
]);

export const geographicAreaSchema = z
  .object({
    id: recordIdSchema,
    slug: slugSchema,
    name: plainTextSchema.max(120),
    kind: areaKindSchema,
    parentAreaId: recordIdSchema.nullable(),
    countryCode: z
      .string()
      .regex(/^[A-Z]{2}$/, {
        error: "Country code must be two uppercase ISO letters.",
      })
      .optional(),
    updatedAt: isoDateTimeSchema,
  })
  .strict()
  .superRefine((area, context) => {
    if (area.kind === "world" && area.parentAreaId !== null) {
      context.addIssue({
        code: "custom",
        path: ["parentAreaId"],
        message: "The world area cannot have a parent.",
      });
    }

    if (area.kind !== "world" && area.parentAreaId === null) {
      context.addIssue({
        code: "custom",
        path: ["parentAreaId"],
        message: `${area.kind} areas must reference a parent area.`,
      });
    }

    if (area.kind === "country" && !area.countryCode) {
      context.addIssue({
        code: "custom",
        path: ["countryCode"],
        message: "Country areas require an ISO country code.",
      });
    }
  });

const socialLinkSchema = z
  .object({
    label: plainTextSchema.max(60),
    url: secureUrlSchema,
  })
  .strict();

export const authorSchema = z
  .object({
    id: recordIdSchema,
    slug: slugSchema,
    name: plainTextSchema.max(120),
    bio: plainTextSchema.max(1_000).optional(),
    website: secureUrlSchema.optional(),
    socialLinks: z.array(socialLinkSchema).max(10).default([]),
    updatedAt: isoDateTimeSchema,
  })
  .strict();

export const placeSchema = z
  .object({
    id: recordIdSchema,
    slug: slugSchema,
    name: plainTextSchema.max(160),
    areaId: recordIdSchema,
    coordinates: coordinatesSchema.nullable(),
    addressSummary: plainTextSchema.max(240).optional(),
    updatedAt: isoDateTimeSchema,
  })
  .strict();

function isSafeLocalMediaPath(value: string): boolean {
  if (
    !value.startsWith("/media/") ||
    value.includes("\\") ||
    value.includes("..")
  ) {
    return false;
  }

  const segments = value.slice("/media/".length).split("/");
  return (
    segments.length > 0 &&
    segments.every((segment) => safeLocalMediaSegment.test(segment))
  );
}

function isSafeMediaSource(value: string): boolean {
  if (isSafeLocalMediaPath(value)) {
    return true;
  }

  const result = secureUrlSchema.safeParse(value);
  return result.success;
}

const mediaSourceSchema = z.string().refine(isSafeMediaSource, {
  error: "Media source must be an HTTPS URL or a safe path below /media/.",
});

const allowedEmbedHosts = new Set([
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "player.vimeo.com",
  "vimeo.com",
]);

export const mediaSchema = z
  .object({
    id: recordIdSchema,
    kind: z.enum(["image", "video", "video-embed"]),
    src: mediaSourceSchema,
    altText: plainTextSchema.max(300),
    caption: plainTextSchema.max(500).optional(),
    poster: mediaSourceSchema.optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    updatedAt: isoDateTimeSchema,
  })
  .strict()
  .superRefine((media, context) => {
    if (media.kind === "video-embed") {
      const parsed = secureUrlSchema.safeParse(media.src);
      if (
        !parsed.success ||
        !allowedEmbedHosts.has(new URL(media.src).hostname.toLowerCase())
      ) {
        context.addIssue({
          code: "custom",
          path: ["src"],
          message:
            "Video embeds are limited to approved YouTube and Vimeo HTTPS hosts.",
        });
      }
    }

    if (
      media.kind === "image" &&
      (media.width === undefined || media.height === undefined)
    ) {
      context.addIssue({
        code: "custom",
        path: ["width"],
        message: "Images require width and height to prevent layout shift.",
      });
    }
  });

const safeMarkdownSchema = z
  .string()
  .trim()
  .min(1, { error: "Story body cannot be empty." })
  .max(50_000, { error: "Story body must contain at most 50,000 characters." })
  .refine(
    (value) =>
      !/<\/?[a-z][^>]*>/i.test(value) &&
      !/(?:javascript|data\s*:\s*text\/html)\s*:/i.test(value) &&
      !/\bon[a-z]+\s*=/i.test(value),
    {
      error:
        "Story Markdown cannot contain raw HTML, script URLs, or inline event handlers.",
    },
  );

const tipSchema = z
  .object({
    id: recordIdSchema,
    perspective: z.enum(["observed", "subjective"]),
    text: plainTextSchema.max(600),
  })
  .strict();

const externalLinkSchema = z
  .object({
    label: plainTextSchema.max(100),
    url: secureUrlSchema,
    kind: z.enum(["official", "booking", "social", "reference", "other"]),
  })
  .strict();

export const controlledTagSchema = z.enum(controlledTagValues);

export const storySchema = z
  .object({
    id: recordIdSchema,
    slug: slugSchema,
    placeId: recordIdSchema,
    authorId: recordIdSchema,
    title: plainTextSchema.max(180),
    summary: plainTextSchema.max(320),
    bodyMarkdown: safeMarkdownSchema,
    visitDate: isoDateSchema,
    authorRating: z.number().min(1).max(5).multipleOf(0.5),
    tips: z.array(tipSchema).max(20).default([]),
    externalLinks: z.array(externalLinkSchema).max(20).default([]),
    mediaIds: z
      .array(recordIdSchema)
      .max(50)
      .refine((ids) => new Set(ids).size === ids.length, {
        error: "A story cannot reference the same media item more than once.",
      }),
    tags: z
      .array(controlledTagSchema)
      .max(20)
      .refine((tags) => new Set(tags).size === tags.length, {
        error: "A story cannot contain duplicate tags.",
      }),
    publicationStatus: z.enum(["draft", "review", "published"]),
    publishedAt: isoDateTimeSchema.nullable(),
    updatedAt: isoDateTimeSchema,
  })
  .strict()
  .superRefine((story, context) => {
    if (story.publicationStatus === "published" && story.publishedAt === null) {
      context.addIssue({
        code: "custom",
        path: ["publishedAt"],
        message: "Published stories require a publishedAt date-time.",
      });
    }

    if (story.publicationStatus !== "published" && story.publishedAt !== null) {
      context.addIssue({
        code: "custom",
        path: ["publishedAt"],
        message: "Only published stories may have a publishedAt date-time.",
      });
    }
  });

export type GeographicArea = z.infer<typeof geographicAreaSchema>;
export type Author = z.infer<typeof authorSchema>;
export type Place = z.infer<typeof placeSchema>;
export type Media = z.infer<typeof mediaSchema>;
export type Story = z.infer<typeof storySchema>;
