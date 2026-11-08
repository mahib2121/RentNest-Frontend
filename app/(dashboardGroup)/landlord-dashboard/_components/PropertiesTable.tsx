"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { VirtualTable } from "@/components/ui/virtual-table";
import EditPropertyDialog from "./EditPropertyDialog";
import type { LandlordProperty } from "../_actions.ts/landlordProperties";
import { deleteProperty } from "../_actions.ts/landlordProperties";
import { Category } from "../_actions.ts/categories";
import AddPropertyDialog from "./AddPropertyDialog";
import { StatusChip } from "../../_components/StatusChip";

type Props = {
  properties: LandlordProperty[];
  categories: Category[];
};

/**
 * The landlord's own property list.
 *
 * The body is virtualised, so a landlord with a long portfolio does not pay
 * for a thousand rows of DOM. The delete handler is kept stable with
 * `useCallback` so a delete only re-renders the columns, not the list.
 */
export default function PropertiesTable({ properties, categories }: Props) {
  const [items, setItems] = useState(properties);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = useCallback(async (propertyId: string) => {
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
  }, []);

  if (items.length === 0) {
    return (
      <div className="rounded-sm border border-line bg-card p-6">
        <h2 className="font-display text-xl">My properties</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          You have not listed any properties yet.
        </p>

        <div className="mt-4">
          <AddPropertyDialog categories={categories} />
        </div>
      </div>
    );
  }

  const columns = [
    {
      key: "property",
      label: "Property",
      renderCell: (property: LandlordProperty) => (
        <>
          <p className="font-medium">{property.title}</p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {property.city}, {property.division}
          </p>
        </>
      ),
    },
    {
      key: "category",
      label: "Category",
      width: "140px",
      renderCell: (property: LandlordProperty) => (
        <span className="text-sm">
          {property.category?.name ?? "Not set"}
        </span>
      ),
    },
    {
      key: "rent",
      label: "Rent",
      width: "110px",
      renderCell: (property: LandlordProperty) => (
        <span className="font-numeric text-sm">
          ৳{property.rentPrice}
        </span>
      ),
    },
    {
      key: "bedrooms",
      label: "Beds",
      width: "72px",
      renderCell: (property: LandlordProperty) => (
        <span className="font-numeric text-sm">{property.bedrooms}</span>
      ),
    },
    {
      key: "bathrooms",
      label: "Baths",
      width: "72px",
      renderCell: (property: LandlordProperty) => (
        <span className="font-numeric text-sm">{property.bathrooms}</span>
      ),
    },
    {
      key: "areaSqft",
      label: "Area",
      width: "104px",
      renderCell: (property: LandlordProperty) => (
        <span className="font-numeric text-sm">
          {property.areaSqft}
          <span className="ml-1 text-xs text-muted-foreground">sqft</span>
        </span>
      ),
    },
    {
      key: "requests",
      label: "Requests",
      width: "96px",
      renderCell: (property: LandlordProperty) => (
        <span className="font-numeric text-sm">
          {property._count?.rentalRequests ?? 0}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "120px",
      renderCell: (property: LandlordProperty) => (
        <StatusChip status={property.availabilityStatus} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      width: "110px",
      align: "right" as const,
      renderCell: (property: LandlordProperty) => (
        <div className="flex justify-end gap-1">
          <EditPropertyDialog property={property} />

          <button
            type="button"
            disabled={deletingId === property.id}
            onClick={() => handleDelete(property.id)}
            className="rounded-sm p-2 text-destructive transition-colors duration-150 ease-out hover:bg-destructive/10 disabled:opacity-50"
            title="Delete property"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl">
          My properties
          <span className="ml-2 font-numeric text-base text-muted-foreground">
            {items.length}
          </span>
        </h2>

        <AddPropertyDialog categories={categories} />
      </div>

      <div className="overflow-hidden rounded-sm border border-line bg-card">
        <VirtualTable
          columns={columns}
          rows={items}
          rowKey={(property) => property.id}
          height={520}
          overscan={8}
          className="rounded-none border-0"
        />
      </div>
    </section>
  );
}
