import { cache } from "react";
import { cacheLife } from "next/cache";
import { serverAxios } from "@/lib/serverAxios";

/**
 * The public listing data is cached for an hour.
 *
 * The backend takes ~1.2 s to answer, and the home page needs the same
 * listings twice (the grid and the market figures). Caching removes the
 * second round trip entirely and lets the page be prerendered at build time
 * with the listings already in the HTML.
 *
 * `"use cache"` (rather than React's `cache()`) is what survives across
 * requests — `cache()` only dedupes within a single render pass.
 */
export const getPropertiesCached = cache(
  async (limit: number): Promise<Property[]> => {
    "use cache";
    cacheLife("hours");

    const api = await serverAxios({ withCookies: false });

    try {
      const response = await api.get("/api/properties", { params: { limit } });

      return readList(response.data as PropertiesResponse);
    } catch (error) {
      console.error("Failed to load properties:", error);

      return [];
    }
  },
);

/**
 * Single source of truth for property data.
 *
 * The home page and the /properties list page both read from here so they
 * render the same listings. Previously each page had its own fetch and its
 * own `Property` shape, which meant the two views disagreed.
 */
export type Property = {
  id: string;
  landlordId?: string;
  categoryId?: string;

  title: string;
  description?: string;

  rentPrice: number | string;

  bedrooms: number;
  bathrooms: number;
  areaSqft: number;

  address: string;
  city: string;
  division?: string;
  postalCode?: string;

  latitude?: string | null;
  longitude?: string | null;

  availableFrom?: string;
  availabilityStatus?: string;

  images?: string[];
  image?: string;

  category?: {
    id: string;
    name: string;
    slug?: string;
  };

  landlord?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };

  createdAt?: string;
  updatedAt?: string;
};

type PropertiesResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: Property[] | { data?: Property[] };
};

/** Pull the array out of either shape the API returns. */
function readList(payload: PropertiesResponse): Property[] {
  const { data } = payload;

  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

/**
 * Fetch properties. `serverAxios()` is called outside the try/catch so
 * Next.js can detect the `cookies()` call it makes.
 */
export async function getProperties(
  params: {
    limit?: number;
    featured?: boolean;
    availabilityStatus?: string;
  } = {},
): Promise<Property[]> {
  // The listings endpoint is public, so no session cookie is sent. That keeps
  // the render free of `cookies()` and lets the page be prerendered.
  const api = await serverAxios({ withCookies: false });

  try {
    const response = await api.get("/api/properties", {
      params: {
        limit: params.limit,
        featured: params.featured,
        availabilityStatus: params.availabilityStatus,
      },
    });

    return readList(response.data as PropertiesResponse);
  } catch (error) {
    console.error("Failed to load properties:", error);

    return [];
  }
}

/**
 * One fetch, shared across the whole render.
 *
 * The home page used to call the backend twice — once for the featured
 * listings and once for the market figures — at roughly 1.2 s each. The
 * response is now cached, so both callers read the same data and the page
 * can be prerendered with the listings already in the HTML.
 */
export async function getAllProperties(): Promise<Property[]> {
  return getPropertiesCached(60);
}

/** A short, scannable set of available listings for the home page. */
export async function getFeaturedProperties(): Promise<Property[]> {
  const properties = await getAllProperties();

  return properties
    .filter(
      (property) =>
        !property.availabilityStatus ||
        property.availabilityStatus.toUpperCase() === "AVAILABLE",
    )
    .slice(0, 6);
}

/* ============================================================
   Market pulse — the figures the home page hero shows.
   Computed from the live listings so the hero states something
   true rather than something decorative.
   ============================================================ */

export type MarketPulse = {
  /** Every listing the API returned. */
  totalCount: number;
  /** Listings that carried a usable rent price. */
  sampleSize: number;
  /** Listings shown as available. */
  listingCount: number;

  medianRent: number;
  lowestRent: number;
  highestRent: number;
  medianArea: number;

  cityCount: number;
  /** The city most listings sit in — used when there is only one. */
  topCity: string | null;

  /** Listings grouped into rent bands, for the band chart. */
  band: {
    label: string;
    count: number;
    percent: number;
  }[];
};

function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

/**
 * Drop the extreme few values before reading the range.
 *
 * Seed listings carry occasional typos — a rent of ৳10,000,000 next to one of
 * ৳12,000. Raw min/max turns those into the headline figure, so the range is
 * read from the middle of the distribution instead.
 */
function trimmedRange(values: number[]): { low: number; high: number } {
  if (values.length === 0) {
    return { low: 0, high: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);

  // Drop the top and bottom fifth of a meaningful sample.
  const trim = sorted.length >= 5 ? 1 : 0;
  const slice = sorted.slice(trim, sorted.length - trim);

  return {
    low: slice[0] ?? 0,
    high: slice[slice.length - 1] ?? 0,
  };
}

const RENT_BANDS = [
  { label: "under 15K", min: 0, max: 15000 },
  { label: "15–30K", min: 15000, max: 30000 },
  { label: "30–50K", min: 30000, max: 50000 },
  { label: "50K+", min: 50000, max: Number.POSITIVE_INFINITY },
];

/**
 * Summarise the market for the home page hero.
 *
 * Every number here comes from the listings the API actually returned. When
 * the API is unreachable the result is empty and the hero shows em dashes
 * rather than invented figures.
 */
export async function getMarketPulse(): Promise<MarketPulse> {
  const properties = await getAllProperties();

  const rents = properties
    .map((property) => Number(property.rentPrice))
    .filter((rent) => Number.isFinite(rent) && rent > 0);

  const areas = properties
    .map((property) => Number(property.areaSqft))
    .filter((area) => Number.isFinite(area) && area > 0);

  const cityCounts = new Map<string, number>();

  properties.forEach((property) => {
    const city = property.city?.trim();

    if (city) {
      cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
    }
  });

  const topCity =
    [...cityCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const available = properties.filter(
    (property) =>
      !property.availabilityStatus ||
      property.availabilityStatus.toUpperCase() === "AVAILABLE",
  );

  const range = trimmedRange(rents);

  const band = RENT_BANDS.map((band) => {
    const count = rents.filter(
      (rent) => rent >= band.min && rent < band.max,
    ).length;

    return {
      label: band.label,
      count,
      percent: rents.length === 0 ? 0 : Math.round((count / rents.length) * 100),
    };
  }).filter((row) => row.count > 0);

  return {
    totalCount: properties.length,
    sampleSize: rents.length,
    listingCount: available.length,
    medianRent: Math.round(median(rents)),
    lowestRent: range.low,
    highestRent: range.high,
    medianArea: Math.round(median(areas)),
    cityCount: cityCounts.size,
    topCity,
    band,
  };
}

/** A single listing, or null when it does not exist. */
export async function getProperty(id: string): Promise<Property | null> {
  const api = await serverAxios();

  try {
    const response = await api.get(`/api/properties/${id}`);

    return (response.data as { data?: Property })?.data ?? null;
  } catch (error) {
    console.error(`Failed to load property ${id}:`, error);

    return null;
  }
}
