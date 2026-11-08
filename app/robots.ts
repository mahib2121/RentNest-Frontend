import type { MetadataRoute } from "next";

/**
 * The crawler's view of the site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  };
}
