"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { createProperty } from "../_actions.ts/landlordProperties";

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
};

export default function AddPropertyDialog({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categoryId, setCategoryId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [rentPrice, setRentPrice] = useState("");

  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [areaSqft, setAreaSqft] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [division, setDivision] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [availableFrom, setAvailableFrom] = useState("");

  function resetForm() {
    setCategoryId("");

    setTitle("");
    setDescription("");

    setRentPrice("");

    setBedrooms("");
    setBathrooms("");
    setAreaSqft("");

    setAddress("");
    setCity("");
    setDivision("");
    setPostalCode("");

    setLatitude("");
    setLongitude("");

    setAvailableFrom("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (!availableFrom) {
      toast.error("Please select an available date.");
      return;
    }

    try {
      setLoading(true);

      const result = await createProperty({
        categoryId,

        title,
        description,

        rentPrice: Number(rentPrice),

        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        areaSqft: Number(areaSqft),

        address,
        city,
        division,

        postalCode: postalCode.trim() || undefined,

        latitude: latitude.trim() !== "" ? Number(latitude) : undefined,

        longitude: longitude.trim() !== "" ? Number(longitude) : undefined,

        availableFrom: new Date(`${availableFrom}T00:00:00.000Z`).toISOString(),
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message || "Property created successfully.");

      setOpen(false);
      resetForm();

      window.location.reload();
    } catch (error) {
      console.error("Create property error:", error);

      toast.error("Failed to create property.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Add Property Button */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        <Plus className="h-4 w-4" />
        Add Property
      </button>

      {/* Dialog */}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-background p-6">
            {/* Header */}

            <div className="mb-6">
              <h2 className="text-xl font-bold">Add Property</h2>

              <p className="text-sm text-muted-foreground">
                Add a new property to your listings.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category */}

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Category
                </label>

                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full rounded border px-3 py-2"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}

              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Modern 2 Bedroom Apartment"
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
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  placeholder="Describe the property..."
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
                  min={0}
                  value={rentPrice}
                  onChange={(e) => setRentPrice(e.target.value)}
                  required
                  placeholder="25000"
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
                    min={0}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    required
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Bathrooms
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    required
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Area (sqft)
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={areaSqft}
                    onChange={(e) => setAreaSqft(e.target.value)}
                    required
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
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="House 10, Road 5"
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              {/* City / Division / Postal */}

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">City</label>

                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Dhaka"
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Division
                  </label>

                  <input
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    required
                    placeholder="Dhaka"
                    className="w-full rounded border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Postal Code
                  </label>

                  <input
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="1212"
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
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="23.8103"
                    className="w-full rounded border px-3 py-2"
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
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="90.4125"
                    className="w-full rounded border px-3 py-2"
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
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  required
                  className="w-full rounded border px-3 py-2"
                />
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
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
                  {loading ? "Creating..." : "Create Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
