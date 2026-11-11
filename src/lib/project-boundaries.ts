export const publicBuildDirectories = ["src", "public"] as const;
export const ownerStudioDirectory = "tools/studio" as const;
export const publicMutationRoutesEnabled = false as const;

export function isOwnerStudioPubliclyReachable(): boolean {
  const studioPath: string = ownerStudioDirectory;

  return publicBuildDirectories.some(
    (directory) =>
      studioPath === directory || studioPath.startsWith(`${directory}/`),
  );
}
