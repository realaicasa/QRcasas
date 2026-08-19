interface TeableAttachment {
  url?: string;
  signedUrl?: string;
}

export const PLACEHOLDER_IMAGE = "/images/property-placeholder.webp";

export function getSafeImageUrl(
  attachment: TeableAttachment | null | undefined,
  fallback: string = PLACEHOLDER_IMAGE,
): string {
  if (!attachment || typeof attachment !== "object") return fallback;
  const url = attachment.signedUrl ?? attachment.url;
  if (typeof url !== "string" || url.length === 0) return fallback;
  return url;
}

export function getSafeImageList(
  attachments: unknown,
  fallback: string = PLACEHOLDER_IMAGE,
): string[] {
  if (!Array.isArray(attachments) || attachments.length === 0) {
    return [fallback];
  }
  const urls: string[] = [];
  for (const att of attachments) {
    if (att && typeof att === "object") {
      const a = att as TeableAttachment;
      const url = a.signedUrl ?? a.url;
      if (typeof url === "string" && url.length > 0) {
        urls.push(url);
      }
    }
  }
  return urls.length > 0 ? urls : [fallback];
}

export function getFirstSafeImage(
  attachments: unknown,
  fallback: string = PLACEHOLDER_IMAGE,
): string {
  const urls = getSafeImageList(attachments, fallback);
  return urls[0] ?? fallback;
}
