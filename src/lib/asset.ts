/**
 * Prefixes a /public file with the site's base path.
 * Needed when the site lives under a sub-path (username.github.io/repo-name),
 * harmless when it sits at the root of a custom domain.
 */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;