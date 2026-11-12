import { createHash } from "node:crypto";

import * as z from "zod";

import {
  buildStorySlug,
  createTravelCatalog,
  type TravelCatalog,
} from "../../src/content/catalog";
import {
  authorSchema,
  mediaSchema,
  placeSchema,
  recordIdSchema,
  secureUrlSchema,
  storySchema,
} from "../../src/content/schemas";
import { controlledTagSchema } from "../../src/content/schemas";

const optionalText = z.string().trim().max(1_000).default("");

const authorInputSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("existing"), id: recordIdSchema }),
  z.object({
    mode: z.literal("new"),
    name: z.string().trim().min(1).max(120),
    bio: optionalText,
  }),
]);

const placeInputSchema = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("existing"), id: recordIdSchema }),
  z.object({
    mode: z.literal("new"),
    name: z.string().trim().min(1).max(160),
    areaId: recordIdSchema,
    addressSummary: z.string().trim().max(240).default(""),
    coordinates: z
      .object({ latitude: z.number(), longitude: z.number() })
      .nullable(),
  }),
]);

const tipInputSchema = z.object({
  perspective: z.enum(["observed", "subjective"]),
  text: z.string().trim().min(1).max(600),
});

const linkInputSchema = z.object({
  label: z.string().trim().min(1).max(100),
  url: secureUrlSchema,
  kind: z.enum(["official", "booking", "social", "reference", "other"]),
});

const uploadedMediaInputSchema = z.object({
  source: z.literal("upload"),
  id: recordIdSchema,
  stagedName: z
    .string()
    .regex(/^[a-z0-9][a-z0-9._-]{2,119}$/i, "Unsafe staged filename."),
  kind: z.enum(["image", "video"]),
  altText: z.string().trim().min(1).max(300),
  caption: z.string().trim().max(500).default(""),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

const embeddedMediaInputSchema = z.object({
  source: z.literal("embed"),
  id: recordIdSchema,
  kind: z.literal("video-embed"),
  src: secureUrlSchema,
  altText: z.string().trim().min(1).max(300),
  caption: z.string().trim().max(500).default(""),
});

const existingMediaInputSchema = z.object({
  source: z.literal("existing"),
  id: recordIdSchema,
  kind: z.enum(["image", "video", "video-embed"]),
  src: z.string().min(1).max(2_000),
  altText: z.string().trim().min(1).max(300),
  caption: z.string().trim().max(500).default(""),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

const studioInputSchema = z.object({
  storyId: recordIdSchema.nullable().default(null),
  author: authorInputSchema,
  place: placeInputSchema,
  story: z.object({
    title: z.string().trim().min(1).max(180),
    summary: z.string().trim().min(1).max(320),
    bodyMarkdown: z.string().trim().min(1).max(50_000),
    visitDate: z.iso.date(),
    authorRating: z.number().min(1).max(5).multipleOf(0.5),
    tags: z.array(controlledTagSchema).max(20),
    tips: z.array(tipInputSchema).max(20),
    externalLinks: z.array(linkInputSchema).max(20),
    media: z
      .array(
        z.discriminatedUnion("source", [
          uploadedMediaInputSchema,
          embeddedMediaInputSchema,
          existingMediaInputSchema,
        ]),
      )
      .max(50),
    coverMediaId: recordIdSchema.nullable(),
  }),
});

export type StudioInput = z.infer<typeof studioInputSchema>;

export type SniffedUpload = {
  extension: string;
  kind: "image" | "video";
  mimeType: string;
  maxBytes: number;
};

export function slugifyStudioValue(value: string): string {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "untitled";
}

export function safeUploadName(
  originalName: string,
  bytes: Uint8Array,
  extension: string,
): string {
  const originalBase = originalName.replace(/\.[^.]+$/, "");
  const base = slugifyStudioValue(originalBase).slice(0, 50);
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  return `${base}-${hash}${extension}`;
}

export function sniffUploadType(head: Uint8Array): SniffedUpload | null {
  const bytes = Buffer.from(head);
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return {
      extension: ".png",
      kind: "image",
      mimeType: "image/png",
      maxBytes: 30_000_000,
    };
  }
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return {
      extension: ".jpg",
      kind: "image",
      mimeType: "image/jpeg",
      maxBytes: 30_000_000,
    };
  }
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return {
      extension: ".webp",
      kind: "image",
      mimeType: "image/webp",
      maxBytes: 30_000_000,
    };
  }
  if (
    bytes.length >= 4 &&
    bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))
  ) {
    return {
      extension: ".webm",
      kind: "video",
      mimeType: "video/webm",
      maxBytes: 250_000_000,
    };
  }
  if (bytes.length >= 12 && bytes.toString("ascii", 4, 8) === "ftyp") {
    const brand = bytes.toString("ascii", 8, 12);
    if (["avif", "avis"].includes(brand)) {
      return {
        extension: ".avif",
        kind: "image",
        mimeType: "image/avif",
        maxBytes: 30_000_000,
      };
    }
    if (["heic", "heix", "hevc", "hevx", "mif1", "msf1"].includes(brand)) {
      return {
        extension: ".heic",
        kind: "image",
        mimeType: "image/heic",
        maxBytes: 30_000_000,
      };
    }
    if (brand === "qt  ") {
      return {
        extension: ".mov",
        kind: "video",
        mimeType: "video/quicktime",
        maxBytes: 250_000_000,
      };
    }
    return {
      extension: ".mp4",
      kind: "video",
      mimeType: "video/mp4",
      maxBytes: 250_000_000,
    };
  }
  return null;
}

export function isAllowedStudioHost(
  host: string | undefined,
  port: number,
): boolean {
  return host === `127.0.0.1:${port}` || host === `localhost:${port}`;
}

function nextUniqueSlug(base: string, used: Set<string>): string {
  if (!used.has(base)) return base;
  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export function parseStudioInput(input: unknown): StudioInput {
  return studioInputSchema.parse(input);
}

export function buildStudioCatalog(
  currentCatalog: TravelCatalog,
  rawInput: unknown,
  updatedAt: string,
): TravelCatalog {
  const input = parseStudioInput(rawInput);
  const catalog = structuredClone(currentCatalog);

  const authorInput = input.author;
  let author =
    authorInput.mode === "existing"
      ? catalog.authors.find((item) => item.id === authorInput.id)
      : undefined;
  if (authorInput.mode === "existing" && !author) {
    throw new Error(`Author "${authorInput.id}" does not exist.`);
  }
  if (authorInput.mode === "new") {
    const slug = slugifyStudioValue(authorInput.name);
    if (
      catalog.authors.some((item) => item.id === slug || item.slug === slug)
    ) {
      throw new Error(
        `An author using "${slug}" already exists; select that author instead.`,
      );
    }
    author = authorSchema.parse({
      id: slug,
      slug,
      name: authorInput.name,
      bio: authorInput.bio || undefined,
      socialLinks: [],
      updatedAt,
    });
    catalog.authors.push(author);
  }

  const placeInput = input.place;
  let place =
    placeInput.mode === "existing"
      ? catalog.places.find((item) => item.id === placeInput.id)
      : undefined;
  if (placeInput.mode === "existing" && !place) {
    throw new Error(`Place "${placeInput.id}" does not exist.`);
  }
  if (placeInput.mode === "new") {
    if (!catalog.areas.some((area) => area.id === placeInput.areaId)) {
      throw new Error(`Area "${placeInput.areaId}" does not exist.`);
    }
    const baseSlug = `${slugifyStudioValue(placeInput.name)}-${placeInput.areaId}`;
    const slug = nextUniqueSlug(
      baseSlug,
      new Set(catalog.places.map((item) => item.slug)),
    );
    place = placeSchema.parse({
      id: slug,
      slug,
      name: placeInput.name,
      areaId: placeInput.areaId,
      coordinates: placeInput.coordinates,
      addressSummary: placeInput.addressSummary || undefined,
      updatedAt,
    });
    catalog.places.push(place);
  }

  if (!author || !place) throw new Error("Author and place are required.");

  const mediaRecords = input.story.media.map((item) => {
    const common = {
      id: item.id,
      kind: item.kind,
      altText: item.altText,
      caption: item.caption || undefined,
      updatedAt,
    };
    return mediaSchema.parse(
      item.source === "upload"
        ? {
            ...common,
            src: `/media/${item.stagedName}`,
            width: item.width,
            height: item.height,
          }
        : {
            ...common,
            src: item.src,
            width: item.source === "existing" ? item.width : undefined,
            height: item.source === "existing" ? item.height : undefined,
          },
    );
  });

  for (const media of mediaRecords) {
    const index = catalog.media.findIndex((item) => item.id === media.id);
    if (index >= 0) catalog.media[index] = media;
    else catalog.media.push(media);
  }

  const existingStory = input.storyId
    ? catalog.stories.find((item) => item.id === input.storyId)
    : undefined;
  if (input.storyId && !existingStory) {
    throw new Error(`Story "${input.storyId}" does not exist.`);
  }

  const storySlugBase = buildStorySlug(
    place.slug,
    input.story.visitDate,
    author.slug,
  );
  const storySlug = existingStory
    ? existingStory.slug
    : nextUniqueSlug(
        storySlugBase,
        new Set(catalog.stories.map((item) => item.slug)),
      );
  const storyId = existingStory?.id ?? storySlug;
  const story = storySchema.parse({
    id: storyId,
    slug: storySlug,
    placeId: place.id,
    authorId: author.id,
    title: input.story.title,
    summary: input.story.summary,
    bodyMarkdown: input.story.bodyMarkdown,
    visitDate: input.story.visitDate,
    authorRating: input.story.authorRating,
    tips: input.story.tips.map((tip, index) => ({
      id: `tip-${String(index + 1).padStart(2, "0")}`,
      ...tip,
    })),
    externalLinks: input.story.externalLinks,
    mediaIds: mediaRecords.map((item) => item.id),
    coverMediaId: input.story.coverMediaId,
    tags: input.story.tags,
    publicationStatus: existingStory?.publicationStatus ?? "draft",
    publishedAt: existingStory?.publishedAt ?? null,
    updatedAt,
  });

  const storyIndex = catalog.stories.findIndex((item) => item.id === story.id);
  if (storyIndex >= 0) catalog.stories[storyIndex] = story;
  else catalog.stories.push(story);

  return createTravelCatalog(catalog);
}
