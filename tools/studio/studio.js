const token =
  document.querySelector('meta[name="studio-token"]')?.content ?? "";
const form = document.querySelector("#story-form");
const storyPicker = document.querySelector("#story-picker");
const authorSelect = document.querySelector("#author-select");
const placeSelect = document.querySelector("#place-select");
const areaSelect = document.querySelector("#area-select");
const tagOptions = document.querySelector("#tag-options");
const tipsList = document.querySelector("#tips-list");
const linksList = document.querySelector("#links-list");
const mediaList = document.querySelector("#media-list");
const validationSummary = document.querySelector("#validation-summary");
const previewContent = document.querySelector("#preview-content");
const autosaveStatus = document.querySelector("#autosave-status");
const uploadStatus = document.querySelector("#upload-status");
const recoveryBanner = document.querySelector("#recovery-banner");

let catalog = null;
let tagValues = [];
let currentStoryId = null;
let mediaItems = [];
let coverMediaId = null;
let recoverySnapshot = null;
let autosaveTimer = null;

function element(selector) {
  const found = document.querySelector(selector);
  if (!found) throw new Error(`Studio element ${selector} is missing.`);
  return found;
}

function value(selector) {
  const control = element(selector);
  return "value" in control ? control.value : "";
}

function setValue(selector, nextValue) {
  const control = element(selector);
  if ("value" in control) control.value = nextValue ?? "";
}

async function api(path, options = {}) {
  const headers = new Headers(options.headers ?? {});
  headers.set("X-Studio-Token", token);
  if (options.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(path, { ...options, headers });
  const data = await response
    .json()
    .catch(() => ({ error: "The studio returned an unreadable response." }));
  if (!response.ok) {
    const error = new Error(
      data.error ?? `Studio request failed (${response.status}).`,
    );
    error.details = data.details ?? [];
    throw error;
  }
  return data;
}

function createOption(valueText, label, selected = false) {
  const option = document.createElement("option");
  option.value = valueText;
  option.textContent = label;
  option.selected = selected;
  return option;
}

function renderSelectors() {
  storyPicker.replaceChildren(createOption("", "New draft"));
  for (const story of catalog.stories) {
    const place = catalog.places.find((item) => item.id === story.placeId);
    storyPicker.append(
      createOption(
        story.id,
        `${story.visitDate} · ${place?.name ?? "Unknown place"} · ${story.title} (${story.publicationStatus})`,
      ),
    );
  }

  authorSelect.replaceChildren(createOption("__new__", "Create a new creator"));
  for (const author of catalog.authors) {
    authorSelect.append(createOption(author.id, author.name));
  }

  placeSelect.replaceChildren(createOption("__new__", "Create a new place"));
  for (const place of catalog.places) {
    const area = catalog.areas.find((item) => item.id === place.areaId);
    placeSelect.append(
      createOption(place.id, `${place.name} · ${area?.name ?? "Unknown area"}`),
    );
  }

  areaSelect.replaceChildren();
  for (const area of catalog.areas.filter((item) => item.kind !== "world")) {
    areaSelect.append(
      createOption(
        area.id,
        `${area.name} (${area.kind})`,
        area.id === "auckland",
      ),
    );
  }

  tagOptions.replaceChildren();
  for (const tag of tagValues) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "tags";
    checkbox.value = tag;
    label.append(checkbox, document.createTextNode(tag.replaceAll("-", " ")));
    tagOptions.append(label);
  }

  if (catalog.authors.some((author) => author.id === "leonna-banzuela")) {
    authorSelect.value = "leonna-banzuela";
  }
  if (catalog.places.some((place) => place.id === "sandy-beach-auckland")) {
    placeSelect.value = "sandy-beach-auckland";
  }
  toggleConditionalFields();
}

function toggleConditionalFields() {
  const newAuthor = authorSelect.value === "__new__";
  for (const field of document.querySelectorAll(".new-author-field"))
    field.hidden = !newAuthor;
  const newPlace = placeSelect.value === "__new__";
  for (const field of document.querySelectorAll(".new-place-field"))
    field.hidden = !newPlace;
}

function labeled(labelText, control, wide = false) {
  const label = document.createElement("label");
  if (wide) label.className = "field-wide";
  label.append(document.createTextNode(labelText), control);
  return label;
}

function removeButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "button button-danger remove-row";
  button.textContent = "Remove";
  return button;
}

function addTipRow(tip = {}) {
  const row = document.createElement("div");
  row.className = "repeat-row tip-row";
  const perspective = document.createElement("select");
  perspective.append(
    createOption("subjective", "Personal note", tip.perspective !== "observed"),
    createOption(
      "observed",
      "Observed on this visit",
      tip.perspective === "observed",
    ),
  );
  perspective.className = "tip-perspective";
  const text = document.createElement("textarea");
  text.className = "tip-text";
  text.rows = 2;
  text.maxLength = 600;
  text.value = tip.text ?? "";
  row.append(
    labeled("Perspective", perspective),
    labeled("Tip", text),
    removeButton(),
  );
  tipsList.append(row);
}

function addLinkRow(link = {}) {
  const row = document.createElement("div");
  row.className = "repeat-row links-row link-row";
  const kind = document.createElement("select");
  for (const valueText of [
    "official",
    "booking",
    "social",
    "reference",
    "other",
  ]) {
    kind.append(createOption(valueText, valueText, link.kind === valueText));
  }
  kind.className = "link-kind";
  const labelInput = document.createElement("input");
  labelInput.className = "link-label";
  labelInput.maxLength = 100;
  labelInput.value = link.label ?? "";
  const url = document.createElement("input");
  url.className = "link-url";
  url.type = "url";
  url.placeholder = "https://…";
  url.value = link.url ?? "";
  row.append(
    labeled("Kind", kind),
    labeled("Link label", labelInput),
    labeled("HTTPS URL", url),
    removeButton(),
  );
  linksList.append(row);
}

function mediaPreviewUrl(item) {
  if (item.source === "upload")
    return `/studio-media/${encodeURIComponent(item.stagedName)}`;
  if (item.source === "existing" && item.src.startsWith("/media/")) {
    return `/public-media/${encodeURIComponent(item.src.slice("/media/".length))}`;
  }
  return item.src;
}

function renderMedia() {
  mediaList.replaceChildren();
  mediaItems.forEach((item, index) => {
    const row = document.createElement("article");
    row.className = "media-row";
    row.dataset.index = String(index);

    const preview = document.createElement("div");
    preview.className = "media-preview";
    if (item.kind === "image") {
      const image = document.createElement("img");
      image.src = mediaPreviewUrl(item);
      image.alt = "";
      preview.append(image);
    } else if (item.kind === "video" && item.source !== "embed") {
      const video = document.createElement("video");
      video.src = mediaPreviewUrl(item);
      video.muted = true;
      video.preload = "metadata";
      preview.append(video);
    } else {
      preview.textContent = "Approved video link";
    }

    const fields = document.createElement("div");
    fields.className = "media-fields";
    const alt = document.createElement("input");
    alt.className = "media-alt";
    alt.maxLength = 300;
    alt.required = true;
    alt.value = item.altText ?? "";
    const caption = document.createElement("input");
    caption.className = "media-caption";
    caption.maxLength = 500;
    caption.value = item.caption ?? "";
    fields.append(
      labeled("Alternative text / video description", alt, true),
      labeled("Caption", caption, true),
    );
    if (item.kind === "image") {
      const width = document.createElement("input");
      width.className = "media-width";
      width.type = "number";
      width.min = "1";
      width.value = item.width ?? "";
      const height = document.createElement("input");
      height.className = "media-height";
      height.type = "number";
      height.min = "1";
      height.value = item.height ?? "";
      fields.append(
        labeled("Pixel width", width),
        labeled("Pixel height", height),
      );
    }
    const cover = document.createElement("input");
    cover.type = "radio";
    cover.name = "media-cover";
    cover.value = item.id;
    cover.checked = coverMediaId === item.id;
    cover.addEventListener("change", () => {
      coverMediaId = item.id;
      scheduleAutosave();
    });
    fields.append(labeled("Use as cover", cover));

    const actions = document.createElement("div");
    actions.className = "media-actions";
    for (const [action, labelText] of [
      ["up", "Move up"],
      ["down", "Move down"],
      ["remove", "Remove"],
    ]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className =
        action === "remove" ? "button button-danger" : "button";
      button.dataset.mediaAction = action;
      button.textContent = labelText;
      if (action === "up" && index === 0) button.disabled = true;
      if (action === "down" && index === mediaItems.length - 1)
        button.disabled = true;
      actions.append(button);
    }

    row.append(preview, fields, actions);
    mediaList.append(row);
  });
}

function syncMediaFields() {
  for (const row of mediaList.querySelectorAll(".media-row")) {
    const index = Number(row.dataset.index);
    const item = mediaItems[index];
    if (!item) continue;
    item.altText = row.querySelector(".media-alt")?.value ?? "";
    item.caption = row.querySelector(".media-caption")?.value ?? "";
    if (item.kind === "image") {
      const width = Number(row.querySelector(".media-width")?.value);
      const height = Number(row.querySelector(".media-height")?.value);
      item.width = Number.isInteger(width) && width > 0 ? width : undefined;
      item.height = Number.isInteger(height) && height > 0 ? height : undefined;
    }
  }
}

function readTips() {
  return [...tipsList.querySelectorAll(".tip-row")]
    .map((row) => ({
      perspective: row.querySelector(".tip-perspective")?.value ?? "subjective",
      text: row.querySelector(".tip-text")?.value.trim() ?? "",
    }))
    .filter((tip) => tip.text);
}

function readLinks() {
  return [...linksList.querySelectorAll(".link-row")]
    .map((row) => ({
      kind: row.querySelector(".link-kind")?.value ?? "other",
      label: row.querySelector(".link-label")?.value.trim() ?? "",
      url: row.querySelector(".link-url")?.value.trim() ?? "",
    }))
    .filter((link) => link.label || link.url);
}

function selectedTags() {
  return [...tagOptions.querySelectorAll('input[name="tags"]:checked')].map(
    (input) => input.value,
  );
}

function buildPayload() {
  syncMediaFields();
  const latitudeText = value("#latitude").trim();
  const longitudeText = value("#longitude").trim();
  if (Boolean(latitudeText) !== Boolean(longitudeText)) {
    throw new Error("Enter both latitude and longitude, or leave both empty.");
  }

  const author =
    authorSelect.value === "__new__"
      ? { mode: "new", name: value("#author-name"), bio: value("#author-bio") }
      : { mode: "existing", id: authorSelect.value };
  const place =
    placeSelect.value === "__new__"
      ? {
          mode: "new",
          name: value("#place-name"),
          areaId: areaSelect.value,
          addressSummary: value("#address-summary"),
          coordinates: latitudeText
            ? {
                latitude: Number(latitudeText),
                longitude: Number(longitudeText),
              }
            : null,
        }
      : { mode: "existing", id: placeSelect.value };

  return {
    storyId: currentStoryId,
    author,
    place,
    story: {
      title: value("#story-title"),
      summary: value("#story-summary"),
      bodyMarkdown: value("#story-body"),
      visitDate: value("#visit-date"),
      authorRating: Number(value("#rating")),
      tags: selectedTags(),
      tips: readTips(),
      externalLinks: readLinks(),
      media: mediaItems,
      coverMediaId,
    },
  };
}

function serializeRecovery() {
  syncMediaFields();
  return {
    currentStoryId,
    coverMediaId,
    mediaItems,
    fields: Object.fromEntries(
      [...form.elements]
        .filter(
          (control) =>
            control.name && control.type !== "file" && control.type !== "radio",
        )
        .map((control) => [
          control.name,
          control.type === "checkbox" ? control.checked : control.value,
        ]),
    ),
    tips: readTips(),
    links: readLinks(),
    selectedTags: selectedTags(),
  };
}

function applyRecovery(snapshot) {
  resetForm(false);
  currentStoryId = snapshot.currentStoryId ?? null;
  coverMediaId = snapshot.coverMediaId ?? null;
  mediaItems = Array.isArray(snapshot.mediaItems) ? snapshot.mediaItems : [];
  for (const [name, fieldValue] of Object.entries(snapshot.fields ?? {})) {
    const control = form.elements.namedItem(name);
    if (!control || !("value" in control)) continue;
    if (control.type === "checkbox") control.checked = Boolean(fieldValue);
    else control.value = String(fieldValue ?? "");
  }
  tipsList.replaceChildren();
  linksList.replaceChildren();
  for (const tip of snapshot.tips ?? []) addTipRow(tip);
  for (const link of snapshot.links ?? []) addLinkRow(link);
  for (const checkbox of tagOptions.querySelectorAll('input[name="tags"]')) {
    checkbox.checked = (snapshot.selectedTags ?? []).includes(checkbox.value);
  }
  storyPicker.value = currentStoryId ?? "";
  toggleConditionalFields();
  renderMedia();
  renderPreview();
}

function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveStatus.textContent = "Changes waiting to autosave…";
  autosaveTimer = setTimeout(async () => {
    try {
      await api("/api/autosave", {
        method: "POST",
        body: JSON.stringify(serializeRecovery()),
      });
      autosaveStatus.textContent = "Autosaved locally";
    } catch (error) {
      autosaveStatus.textContent = `Autosave failed: ${error.message}`;
    }
  }, 900);
}

function resetForm(keepSelectors = true) {
  form.reset();
  currentStoryId = null;
  mediaItems = [];
  coverMediaId = null;
  tipsList.replaceChildren();
  linksList.replaceChildren();
  if (keepSelectors) {
    storyPicker.value = "";
    if (catalog.authors.some((item) => item.id === "leonna-banzuela")) {
      authorSelect.value = "leonna-banzuela";
    }
    placeSelect.value = catalog.places[0]?.id ?? "__new__";
    areaSelect.value = catalog.areas.some((item) => item.id === "auckland")
      ? "auckland"
      : areaSelect.options[0]?.value;
  }
  toggleConditionalFields();
  renderMedia();
  hideErrors();
}

function loadStory(storyId) {
  const story = catalog.stories.find((item) => item.id === storyId);
  if (!story) {
    resetForm();
    return;
  }
  currentStoryId = story.id;
  storyPicker.value = story.id;
  authorSelect.value = story.authorId;
  placeSelect.value = story.placeId;
  setValue("#story-title", story.title);
  setValue("#visit-date", story.visitDate);
  setValue("#rating", String(story.authorRating));
  setValue("#story-summary", story.summary);
  setValue("#story-body", story.bodyMarkdown);
  tipsList.replaceChildren();
  linksList.replaceChildren();
  for (const tip of story.tips) addTipRow(tip);
  for (const link of story.externalLinks) addLinkRow(link);
  for (const checkbox of tagOptions.querySelectorAll('input[name="tags"]')) {
    checkbox.checked = story.tags.includes(checkbox.value);
  }
  mediaItems = story.mediaIds
    .map((id) => catalog.media.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => ({
      source: item.kind === "video-embed" ? "embed" : "existing",
      id: item.id,
      kind: item.kind,
      src: item.src,
      poster: item.poster,
      altText: item.altText,
      caption: item.caption ?? "",
      width: item.width,
      height: item.height,
      variants: item.variants,
    }));
  coverMediaId = story.coverMediaId;
  toggleConditionalFields();
  renderMedia();
  renderPreview();
}

function showErrors(error) {
  validationSummary.replaceChildren();
  const strong = document.createElement("strong");
  strong.textContent = error.message || "The draft could not be saved.";
  validationSummary.append(strong);
  if (Array.isArray(error.details) && error.details.length) {
    const list = document.createElement("ul");
    for (const detail of error.details) {
      const item = document.createElement("li");
      item.textContent = detail;
      list.append(item);
    }
    validationSummary.append(list);
  }
  validationSummary.hidden = false;
  validationSummary.focus();
}

function hideErrors() {
  validationSummary.hidden = true;
  validationSummary.replaceChildren();
}

function renderPreview() {
  syncMediaFields();
  previewContent.replaceChildren();
  const placeName =
    placeSelect.value === "__new__"
      ? value("#place-name")
      : placeSelect.selectedOptions[0]?.textContent?.split(" · ")[0];
  const eyebrow = document.createElement("p");
  eyebrow.className = "step";
  eyebrow.textContent = `${placeName || "Place"} · ${value("#visit-date") || "visit date"}`;
  const heading = document.createElement("h3");
  heading.textContent = value("#story-title") || "Untitled story";
  const summary = document.createElement("p");
  summary.textContent = value("#story-summary") || "Add a short summary.";
  previewContent.append(eyebrow, heading, summary);

  if (mediaItems.length) {
    const gallery = document.createElement("div");
    gallery.className = "preview-media";
    for (const item of mediaItems) {
      if (item.kind === "image") {
        const image = document.createElement("img");
        image.src = mediaPreviewUrl(item);
        image.alt = item.altText || "Preview image awaiting alternative text";
        gallery.append(image);
      } else if (item.kind === "video" && item.source !== "embed") {
        const video = document.createElement("video");
        video.src = mediaPreviewUrl(item);
        video.controls = true;
        video.preload = "metadata";
        gallery.append(video);
      } else {
        const link = document.createElement("a");
        link.href = item.src;
        link.textContent = item.altText || "Video link";
        link.rel = "noreferrer";
        gallery.append(link);
      }
    }
    previewContent.append(gallery);
  }

  for (const paragraphText of value("#story-body")
    .split(/\n{2,}/)
    .filter(Boolean)) {
    const paragraph = document.createElement("p");
    paragraph.textContent = paragraphText;
    previewContent.append(paragraph);
  }
}

async function uploadFiles(files) {
  if (mediaItems.length + files.length > 50)
    throw new Error("A story can contain at most 50 media items.");
  for (const [index, file] of [...files].entries()) {
    uploadStatus.textContent = `Inspecting and staging ${index + 1} of ${files.length}: ${file.name}`;
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-File-Name": encodeURIComponent(file.name),
        "X-Studio-Token": token,
      },
      body: file,
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error ?? `Upload failed for ${file.name}.`);
    if (!mediaItems.some((item) => item.id === data.upload.id)) {
      mediaItems.push({
        source: "upload",
        id: data.upload.id,
        stagedName: data.upload.stagedName,
        kind: data.upload.kind,
        altText: "",
        caption: "",
        width: data.upload.width,
        height: data.upload.height,
      });
    }
  }
  uploadStatus.textContent = `${files.length} file${files.length === 1 ? "" : "s"} staged locally.`;
  renderMedia();
  scheduleAutosave();
}

form.addEventListener("input", scheduleAutosave);
authorSelect.addEventListener("change", toggleConditionalFields);
placeSelect.addEventListener("change", toggleConditionalFields);
storyPicker.addEventListener("change", () => {
  if (storyPicker.value) loadStory(storyPicker.value);
  else resetForm();
});

element("#add-tip").addEventListener("click", () => {
  addTipRow();
  scheduleAutosave();
});
element("#add-link").addEventListener("click", () => {
  addLinkRow();
  scheduleAutosave();
});
tipsList.addEventListener("click", (event) => {
  if (event.target.closest(".remove-row"))
    event.target.closest(".repeat-row")?.remove();
});
linksList.addEventListener("click", (event) => {
  if (event.target.closest(".remove-row"))
    event.target.closest(".repeat-row")?.remove();
});

element("#media-files").addEventListener("change", async (event) => {
  try {
    await uploadFiles(event.target.files ?? []);
    event.target.value = "";
  } catch (error) {
    showErrors(error);
  }
});

element("#add-embed").addEventListener("click", () => {
  const src = value("#embed-url").trim();
  const altText = value("#embed-alt").trim();
  if (!src || !altText) {
    showErrors(
      new Error("Add both the approved video URL and a video description."),
    );
    return;
  }
  mediaItems.push({
    source: "embed",
    id: `media-${crypto.randomUUID()}`,
    kind: "video-embed",
    src,
    altText,
    caption: "",
  });
  setValue("#embed-url", "");
  setValue("#embed-alt", "");
  renderMedia();
  scheduleAutosave();
});

mediaList.addEventListener("click", (event) => {
  const action = event.target.closest("button[data-media-action]")?.dataset
    .mediaAction;
  const row = event.target.closest(".media-row");
  if (!action || !row) return;
  syncMediaFields();
  const index = Number(row.dataset.index);
  if (action === "remove") {
    const [removed] = mediaItems.splice(index, 1);
    if (coverMediaId === removed?.id) coverMediaId = null;
  } else {
    const nextIndex = action === "up" ? index - 1 : index + 1;
    if (nextIndex >= 0 && nextIndex < mediaItems.length) {
      [mediaItems[index], mediaItems[nextIndex]] = [
        mediaItems[nextIndex],
        mediaItems[index],
      ];
    }
  }
  renderMedia();
  scheduleAutosave();
});

element("#preview-story").addEventListener("click", renderPreview);

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideErrors();
  try {
    const payload = buildPayload();
    const result = await api("/api/save", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    catalog = result.catalog;
    currentStoryId = result.storyId ?? currentStoryId;
    renderSelectors();
    if (currentStoryId) loadStory(currentStoryId);
    else storyPicker.value = "";
    autosaveStatus.textContent =
      "Validated draft saved to content/data/catalog.json";
  } catch (error) {
    showErrors(error);
  }
});

element("#restore-recovery").addEventListener("click", () => {
  if (recoverySnapshot) applyRecovery(recoverySnapshot);
  recoveryBanner.hidden = true;
});

element("#discard-recovery").addEventListener("click", async () => {
  await api("/api/recovery/clear", { method: "POST", body: "{}" });
  recoverySnapshot = null;
  recoveryBanner.hidden = true;
});

async function start() {
  try {
    const [catalogResult, recoveryResult] = await Promise.all([
      api("/api/catalog"),
      api("/api/recovery"),
    ]);
    catalog = catalogResult.catalog;
    tagValues = catalogResult.tagValues;
    renderSelectors();
    resetForm();
    recoverySnapshot = recoveryResult.recovery;
    recoveryBanner.hidden = !recoverySnapshot;
  } catch (error) {
    showErrors(error);
  }
}

start();
