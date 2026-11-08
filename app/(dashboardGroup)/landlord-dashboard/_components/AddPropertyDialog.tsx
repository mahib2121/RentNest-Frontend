"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createProperty } from "../_actions.ts/landlordProperties";

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
};

/**
 * The dialog for listing a property.
 *
 * The form fields are uncontrolled. They used to be held in fourteen pieces
 * of component state, which meant every keystroke in the description re-
 * rendered the whole dialog — fourteen inputs, the category list, and the
 * buttons. The browser already holds the values, so the form reads them with
 * `FormData` when it is submitted and nothing re-renders while typing.
 *
 * The category is the exception: it is a radix `Select`, which is not a
 * native form control, so its value is mirrored into a hidden input.
 */
export default function AddPropertyDialog({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = formRef.current;

    if (!form) return;

    const data = new FormData(form);

    const categoryId = String(data.get("categoryId") ?? "");
    const availableFrom = String(data.get("availableFrom") ?? "");

    if (!categoryId) {
      toast.error("Select a category for the property.");
      return;
    }

    if (!availableFrom) {
      toast.error("Select the date the property becomes available.");
      return;
    }

    const postalCode = String(data.get("postalCode") ?? "").trim();
    const latitude = String(data.get("latitude") ?? "").trim();
    const longitude = String(data.get("longitude") ?? "").trim();

    try {
      setLoading(true);

      const result = await createProperty({
        categoryId,

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

        latitude: latitude !== "" ? Number(latitude) : undefined,

        longitude: longitude !== "" ? Number(longitude) : undefined,

        availableFrom: new Date(`${availableFrom}T00:00:00.000Z`).toISOString(),
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message || "Property created.");

      setOpen(false);

      form.reset();

      window.location.reload();
    } catch (error) {
      console.error("Create property error:", error);

      toast.error("Failed to create the property.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add property
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-h-[90vh]
    gap-0
    overflow-y-auto
    p-0
    sm:max-w-2xl
    bg-background
    text-foreground
    border
    border-border
    shadow-xl
    opacity-100
"
        >
          <DialogHeader className="border-b border-line px-6 py-4">
            <DialogTitle>Add property</DialogTitle>

            <DialogDescription>
              List a property so tenants can apply to rent it.
            </DialogDescription>
          </DialogHeader>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-5 px-6 py-5"
          >
            {/* Category — a radix Select is not a native control, so its
                value is mirrored into a hidden input for FormData. */}
            <div className="space-y-1.5">
              <Label htmlFor="category">Category</Label>

              <Select
                onValueChange={(value) => {
                  if (categoryInputRef.current) {
                    categoryInputRef.current.value = value;
                  }
                }}
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>

                <SelectContent className="bg-popover text-popover-foreground border border-border shadow-lg opacity-100">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <input
                ref={categoryInputRef}
                type="hidden"
                name="categoryId"
                defaultValue=""
              />
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>

              <Input
                id="title"
                name="title"
                required
                placeholder="Two bedroom apartment in Dhanmondi"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>

              <Textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Describe the property, its condition, and what is nearby."
              />
            </div>

            {/* Rent */}
            <div className="space-y-1.5">
              <Label htmlFor="rentPrice">Monthly rent</Label>

              <Input
                id="rentPrice"
                name="rentPrice"
                type="number"
                min={0}
                required
                placeholder="25000"
                className="font-numeric"
              />
            </div>

            {/* Bedrooms / Bathrooms / Area */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="bedrooms">Bedrooms</Label>

                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  min={0}
                  required
                  className="font-numeric"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bathrooms">Bathrooms</Label>

                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  min={0}
                  required
                  className="font-numeric"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="areaSqft">Area (sqft)</Label>

                <Input
                  id="areaSqft"
                  name="areaSqft"
                  type="number"
                  min={0}
                  required
                  className="font-numeric"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>

              <Input
                id="address"
                name="address"
                required
                placeholder="House 10, Road 5"
              />
            </div>

            {/* City / Division / Postal */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>

                <Input id="city" name="city" required placeholder="Dhaka" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="division">Division</Label>

                <Input
                  id="division"
                  name="division"
                  required
                  placeholder="Dhaka"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="postalCode">Postal code</Label>

                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="1212"
                  className="font-numeric"
                />
              </div>
            </div>

            {/* Latitude / Longitude */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="latitude">Latitude</Label>

                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  placeholder="23.8103"
                  className="font-numeric"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="longitude">Longitude</Label>

                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  placeholder="90.4125"
                  className="font-numeric"
                />
              </div>
            </div>

            {/* Available From */}
            <div className="space-y-1.5">
              <Label htmlFor="availableFrom">Available from</Label>

              <Input
                id="availableFrom"
                name="availableFrom"
                type="date"
                required
                className="font-numeric"
              />
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
                {loading ? "Creating" : "Create property"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
