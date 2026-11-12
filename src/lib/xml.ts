export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function siteUrl(pathname: string, configuredSite?: URL): string {
  return new URL(pathname, configuredSite ?? new URL("http://127.0.0.1:4321"))
    .href;
}
