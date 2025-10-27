export function buildPublicAssetUrl(relativeOrAbsolutePath) {
  const providedPath = String(relativeOrAbsolutePath || "");

  if (/^https?:\/\//i.test(providedPath)) {
    return providedPath;
  }

  const normalizedPath = providedPath.startsWith("/")
    ? providedPath.slice(1)
    : providedPath;

  const viteBase = (typeof import.meta !== "undefined" && import.meta.env && typeof import.meta.env.BASE_URL === "string")
    ? import.meta.env.BASE_URL
    : "/";

  const normalizedBase = viteBase === "./" ? "/" : viteBase;

  const origin = (typeof window !== "undefined" && window.location && window.location.origin)
    ? window.location.origin
    : "http://localhost";

  const url = new URL(`${normalizedBase}${normalizedPath}`, origin);
  return url.toString();
}

export function assetUrl(pathFromPublicRoot) {
  return buildPublicAssetUrl(pathFromPublicRoot);
}
