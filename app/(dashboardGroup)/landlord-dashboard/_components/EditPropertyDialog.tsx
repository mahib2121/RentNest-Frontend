"use client";

import { useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { LandlordProperty } from "../_actions.ts/landlordProperties";
import { updateProperty } from "../_actions.ts/landlordProperties";

type Props = {
  property: LandlordProperty;
};

/**
 * The dialog for editing a listing.
 *
 * Uncontrolled, like the add dialog: the fields hold their values in the
 * browser and the form reads them with `FormData` on submit. Typing in the
 * description no longer re-renders twelve inputs and the dialog chrome on
 * every keystroke.
 */
export default function EditPropertyDialog({ property }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const availableFromDefault = property.availableFrom
    ? property.availableFrom.slice(0, 10)
    : "";

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = formRef.current;

    if (!form) return;

    const data = new FormData(form);

    const postalCode = String(data.get("postalCode") ?? "").trim();
    const latitude = String(data.get("latitude") ?? "").trim();
    const longitude = String(data.get("longitude") ?? "").trim();
    const availableFrom = String(data.get("availableFrom") ?? "");

    try {
      setLoading(true);

      const result = await updateProperty(property.id, {
        categoryId: property.categoryId,

        title: String(data.get("title") ?? ""),
        description: String(data.get("description") ?? ""),

        rentPrice: Number(data.get("rentPrice")),

        bedrooms: Number(data.get("bedrooms")),
        bathrooms: Number(data.get("bathrooms")),
        areaSqft: Number(data.get("areaSqft")),

        address: String(data.get("address") ?? ""),
        city: String(data.get("city") ?? ""),
        division: String(data.get("division") ?? ""),

        postalCode: postalCode || undefined,

        latitude:
          latitude.trim() !== "" ? Number(latitude) : undefined,

        longitude:
          longitude.trim() !== "" ? Number(longitude) : undefined,

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

      toast.success(result.message || "Property updated.");

      setOpen(false);

      window.location.reload();
    } catch (error) {
      console.error("Update property error:", error);

      toast.error("Failed to update property.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-sm p-2 text-muted-foreground transition-colors duration-150 ease-out hover:bg-secondary hover:text-foreground"
        title="Edit property"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-line px-6 py-4">
            <DialogTitle>Edit property</DialogTitle>

            <DialogDescription>
              Update the listing details for {property.title}.
            </DialogDescription>
          </DialogHeader>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-5 px-6 py-5"
          >
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor={`title-${property.id}`}>
                Title
              </Label>

              <Input
                id={`title-${property.id}`}
                name="title"
                defaultValue={property.title}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor={`description-${property.id}`}>
                Description
              </Label>

              <Textarea
                id={`description-${property.id}`}
                name="description"
                defaultValue={property.description}
                required
                rows={4}
              />
            </div>

            {/* Rent */}
            <div className="space-y-1.5">
              <Label htmlFor={`rentPrice-${property.id}`}>
                Monthly rent
              </Label>

              <Input
                id={`rentPrice-${property.id}`}
                name="rentPrice"
                type="number"
                min={0}
                defaultValue={property.rentPrice}
                required
                className="font-numeric"
              />
            </div>

            {/* Bedrooms / Bathrooms / Area */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor={`bedrooms-${property.id}`}>
                  Bedrooms
                </Label>

                <Input
                  id={`bedrooms-${property.id}`}
                  name="bedrooms"
                  type="number"
                  min={0}
                  defaultValue={property.bedrooms}
                  required
                  className="font-numeric"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`bathrooms-${property.id}`}>
                  Bathrooms
                </Label>

                <Input
                  id={`bathrooms-${property.id}`}
                  name="bathrooms"
                  type="number"
                  min={0}
                  defaultValue={property.bathrooms}
                  required
                  className="font-numeric"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`areaSqft-${property.id}`}>
                  Area (sqft)
                </Label>

                <Input
                  id={`areaSqft-${property.id}`}
                  name="areaSqft"
                  type="number"
                  min={0}
                  defaultValue={property.areaSqft}
                  required
                  className="font-numeric"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor={`address-${property.id}`}>
                Address
              </Label>

              <Input
                id={`address-${property.id}`}
                name="address"
                defaultValue={property.address}
                required
              />
            </div>

            {/* City / Division / Postal */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor={`city-${property.id}`}>
                  City
                </Label>

                <Input
                  id={`city-${property.id}`}
                  name="city"
                  defaultValue={property.city}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`division-${property.id}`}>
                  Division
                </Label>

                <Input
                  id={`division-${property.id}`}
                  name="division"
                  defaultValue={property.division}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`postalCode-${property.id}`}>
                  Postal code
                </Label>

                <Input
                  id={`postalCode-${property.id}`}
                  name="postalCode"
                  defaultValue={property.postalCode}
                  className="font-numeric"
                />
              </div>
            </div>

            {/* Latitude / Longitude */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={`latitude-${property.id}`}>
                  Latitude
                </Label>

                <Input
                  id={`latitude-${property.id}`}
                  name="latitude"
                  type="number"
                  step="any"
                  defaultValue={property.latitude ?? ""}
                  placeholder="23.8103"
                  className="font-numeric"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`longitude-${property.id}`}>
                  Longitude
                </Label>

                <Input
                  id={`longitude-${property.id}`}
                  name="longitude"
                  type="number"
                  step="any"
                  defaultValue={property.longitude ?? ""}
                  placeholder="90.4125"
                  className="font-numeric"
                />
              </div>
            </div>

            {/* Available From */}
            <div className="space-y-1.5">
              <Label htmlFor={`availableFrom-${property.id}`}>
                Available from
              </Label>

              <Input
                id={`availableFrom-${property.id}`}
                name="availableFrom"
                type="date"
                defaultValue={availableFromDefault}
                required
                className="font-numeric"
              />
            </div>

            {/* Category — read only */}
            <div className="space-y-1.5">
              <Label htmlFor={`category-${property.id}`}>
                Category
              </Label>

              <Input
                id={`category-${property.id}`}
                value={property.category?.name ?? "Not set"}
                disabled
                className="bg-secondary/50 text-muted-foreground"
              />

              <p className="text-xs text-muted-foreground">
                The category cannot be changed after the listing is
                created.
              </p>
            </div>

            <DialogFooter className="border-t border-line pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
