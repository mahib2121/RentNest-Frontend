"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Pencil } from "lucide-react";
import EditPropertyDialog from "./EditPropertyDialog";
import type { LandlordProperty } from "../_actions.ts/landlordProperties";
import { deleteProperty } from "../_actions.ts/landlordProperties";
import { Category } from "../_actions.ts/categories";
import AddPropertyDialog from "./AddPropertyDialog";

type Props = {
  properties: LandlordProperty[];
  categories: Category[];
};

export default function PropertiesTable({ properties, categories }: Props) {
  const [items, setItems] = useState(properties);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(propertyId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(propertyId);

      const result = await deleteProperty(propertyId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setItems((current) =>
        current.filter((property) => property.id !== propertyId),
      );

      toast.success(result.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete property.");
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold">My Properties</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          You have not added any properties yet.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Properties</h2>

          <p className="text-sm text-muted-foreground">
            Manage your properties.
          </p>
        </div>

       <AddPropertyDialog categories={categories}></AddPropertyDialog>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left text-sm font-medium">Property</th>

              <th className="p-4 text-left text-sm font-medium">Category</th>

              <th className="p-4 text-left text-sm font-medium">Rent</th>

              <th className="p-4 text-left text-sm font-medium">Details</th>

              <th className="p-4 text-left text-sm font-medium">Requests</th>

              <th className="p-4 text-left text-sm font-medium">Status</th>

              <th className="p-4 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((property) => (
              <tr key={property.id} className="border-b last:border-0">
                {/* Property */}
                <td className="p-4">
                  <div>
                    <p className="font-semibold">{property.title}</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {property.city}, {property.division}
                    </p>
                  </div>
                </td>

                {/* Category */}
                <td className="p-4">{property.category?.name ?? "N/A"}</td>

                {/* Rent */}
                <td className="p-4">
                  <span className="font-semibold">৳{property.rentPrice}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </td>

                {/* Details */}
                <td className="p-4">
                  <div className="text-sm">
                    <p>
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </p>

                    <p className="text-muted-foreground">
                      {property.areaSqft} sqft
                    </p>
                  </div>
                </td>

                {/* Rental Requests */}
                <td className="p-4">{property._count?.rentalRequests ?? 0}</td>

                {/* Status */}
                <td className="p-4">
                  <span className="rounded border px-2 py-1 text-xs">
                    {property.availabilityStatus}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <EditPropertyDialog property={property} />

                    <button
                      type="button"
                      disabled={deletingId === property.id}
                      onClick={() => handleDelete(property.id)}
                      className="rounded border p-2 text-destructive disabled:opacity-50"
                      title="Delete property"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
