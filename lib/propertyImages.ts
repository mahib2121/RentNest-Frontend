/**
 * Property images, as the backend returns them.
 *
 * Images are stored in Cloudinary and come back as objects. The field names
 * are read defensively (`url`, `imageUrl`, `secureUrl`) so a small change in
 * the backend's response shape does not break every card on the site, and a
 * plain string is still accepted for older data.
 */

export const MAX_PROPERTY_IMAGES = 10;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export type PropertyImage = {
  id: string;
  url: string;
  isCover: boolean;
};

export type RawPropertyImage =
  | string
  | {
      id?: string;
      url?: string;
      imageUrl?: string;
      secureUrl?: string;
      secure_url?: string;
      isCover?: boolean;
      [key: string]: unknown;
    };

/** Turns whatever the API sent into a list with the cover image first. */
export function normalizeImages(raw: unknown): PropertyImage[] {
  if (!Array.isArray(raw)) return [];

  const images = raw
    .map((item: RawPropertyImage, index): PropertyImage | null => {
      if (typeof item === "string") {
        return { id: item, url: item, isCover: index === 0 };
      }

      if (!item || typeof item !== "object") return null;

      const url =
        item.url ?? item.secureUrl ?? item.secure_url ?? item.imageUrl ?? "";

      if (typeof url !== "string" || !url) return null;

      return {
        id: String(item.id ?? url),
        url,
        isCover: Boolean(item.isCover),
      };
    })
    .filter((image): image is PropertyImage => image !== null);

  // If the API did not flag a cover, the first image is the cover.
  if (images.length > 0 && !images.some((image) => image.isCover)) {
    images[0] = { ...images[0], isCover: true };
  }

  return images.sort((a, b) => Number(b.isCover) - Number(a.isCover));
}

/** Image URLs for display, cover first. */
export function imageUrls(images: unknown, fallback?: string | null): string[] {
  const urls = normalizeImages(images).map((image) => image.url);

  if (urls.length === 0 && fallback) return [fallback];

  return urls;
}

/** Returns an error message for a file the backend would reject, or null. */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `${file.name}: only JPEG, PNG, WebP and AVIF images are allowed.`;
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return `${file.name}: images must be 5 MB or smaller.`;
  }

  return null;
}
