"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import type { LandlordProperty } from "../_actions.ts/landlordProperties";
import { updateProperty } from "../_actions.ts/landlordProperties";

type Props = {
  property: LandlordProperty;
};

export default function EditPropertyDialog({
  property,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(property.title);
  const [description, setDescription] = useState(
    property.description,
  );

  const [rentPrice, setRentPrice] = useState(
    property.rentPrice,
  );

  const [bedrooms, setBedrooms] = useState(
    property.bedrooms,
  );

  const [bathrooms, setBathrooms] = useState(
    property.bathrooms,
  );

  const [areaSqft, setAreaSqft] = useState(
    property.areaSqft,
  );

  const [address, setAddress] = useState(
    property.address,
  );

  const [city, setCity] = useState(property.city);

  const [division, setDivision] = useState(
    property.division,
  );

  const [postalCode, setPostalCode] = useState(
    property.postalCode,
  );

  const [latitude, setLatitude] = useState(
    property.latitude ?? "",
  );

  const [longitude, setLongitude] = useState(
    property.longitude ?? "",
  );

  const [availableFrom, setAvailableFrom] = useState(
    property.availableFrom
      ? property.availableFrom.slice(0, 10)
      : "",
  );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setLoading(true);

      const result = await updateProperty(property.id, {
        categoryId: property.categoryId,

        title,
        description,

        rentPrice: Number(rentPrice),

        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        areaSqft: Number(areaSqft),

        address,
        city,
        division,
        postalCode,

        latitude:
          latitude.trim() !== ""
            ? Number(latitude)
            : undefined,

        longitude:
          longitude.trim() !== ""
            ? Number(longitude)
            : undefined,

        availableFrom:
          availableFrom !== ""
            ? new Date(
                `${availableFrom}T00:00:00.000Z`,
              ).toISOString()
            : undefined,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(
        result.message || "Property updated successfully.",
      );

      setOpen(false);

      window.location.reload();
    } catch (error) {
      console.error(
        "Update property error:",
        error,
      );

      toast.error(
        "Failed to update property.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Edit Button */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded border p-2"
        title="Edit property"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {/* Dialog */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-background p-6">
            {/* Header */}

            <div className="mb-6">
              <h2 className="text-xl font-bold">
                Edit Property
              </h2>

              <p className="text-sm text-muted-foreground">
                Update your property information.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Title */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Title
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  required
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  required
                  rows={4}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              {/* Rent */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Monthly Rent
                </label>

                <input
                  type="number"
                  value={rentPrice}
                  onChange={(e) =>
                    setRentPrice(e.target.value)
                  }
                  required
                  min={0}
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              {/* Bedrooms / Bathrooms / Area */}

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Bedrooms
                  </label>

                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) =>
                      setBedrooms(
                        Number(e.target.value),
                      )
                    }
                    required
                    min={0}
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Bathrooms
                  </label>

                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) =>
                      setBathrooms(
                        Number(e.target.value),
                      )
                    }
                    required
                    min={0}
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Area (sqft)
                  </label>

                  <input
                    type="number"
                    value={areaSqft}
                    onChange={(e) =>
                      setAreaSqft(
                        Number(e.target.value),
                      )
                    }
                    required
                    min={0}
                    className="w-full rounded border px-3 py-2"
                  />
                </div>
              </div>

              {/* Address */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Address
                </label>

                <input
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  required
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              {/* City / Division / Postal */}

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    City
                  </label>

                  <input
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
                    }
                    required
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Division
                  </label>

                  <input
                    value={division}
                    onChange={(e) =>
                      setDivision(e.target.value)
                    }
                    required
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Postal Code
                  </label>

                  <input
                    value={postalCode}
                    onChange={(e) =>
                      setPostalCode(e.target.value)
                    }
                    className="w-full rounded border px-3 py-2"
                  />
                </div>
              </div>

              {/* Latitude / Longitude */}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) =>
                      setLatitude(e.target.value)
                    }
                    className="w-full rounded border px-3 py-2"
                    placeholder="23.8103"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) =>
                      setLongitude(e.target.value)
                    }
                    className="w-full rounded border px-3 py-2"
                    placeholder="90.4125"
                  />
                </div>
              </div>

              {/* Available From */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Available From
                </label>

                <input
                  type="date"
                  value={availableFrom}
                  onChange={(e) =>
                    setAvailableFrom(
                      e.target.value,
                    )
                  }
                  required
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              {/* Category */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Category
                </label>

                <input
                  value={
                    property.category?.name ??
                    "Unknown"
                  }
                  disabled
                  className="w-full rounded border bg-muted px-3 py-2"
                />

                <p className="mt-1 text-xs text-muted-foreground">
                  Current category:{" "}
                  {property.category?.name ??
                    "Unknown"}
                </p>
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setOpen(false)
                  }
                  disabled={loading}
                  className="rounded border px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
                >
                  {loading
                    ? "Updating..."
                    : "Update Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}