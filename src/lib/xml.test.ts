import { describe, expect, it } from "vitest";

import { escapeXml, siteUrl } from "./xml";

describe("XML and absolute URL helpers", () => {
  it("escapes untrusted XML text", () => {
    expect(escapeXml(`<script title="A&B">'x'</script>`)).toBe(
      "&lt;script title=&quot;A&amp;B&quot;&gt;&apos;x&apos;&lt;/script&gt;",
    );
  });

  it("uses the configured production origin and a loopback-only local fallback", () => {
    expect(
      siteUrl("/stories/example", new URL("https://travel.example/")),
    ).toBe("https://travel.example/stories/example");
    expect(siteUrl("/stories/example")).toBe(
      "http://127.0.0.1:4321/stories/example",
    );
  });
});
