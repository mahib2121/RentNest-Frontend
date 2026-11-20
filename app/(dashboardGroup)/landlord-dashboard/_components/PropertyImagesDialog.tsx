"use client";

import { useState } from "react";
import Image from "next/image";
import { Images, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MAX_PROPERTY_IMAGES,
  normalizeImages,
  type PropertyImage,
} from "@/lib/propertyImages";

import type { LandlordProperty } from "../_actions.ts/landlordProperties";
import {
  deletePropertyImage,
  setPropertyCoverImage,
  uploadPropertyImages,
} from "../_actions.ts/landlordProperties";
import ImageFilePicker from "./ImageFilePicker";

type Props = {
  property: LandlordProperty;
  /** Called with the new image list so the table thumbnail stays current. */
  onImagesChange?: (propertyId: string, images: PropertyImage[]) => void;
};

/**
 * Manages a listing's photos: upload more, choose the cover, delete.
 *
 * The image endpoints may or may not echo back the updated list, so each
 * change is applied locally the way the backend applies it (the first image
 * is the cover; deleting the cover promotes the next one) and replaced with
 * the server's list whenever one comes back.
 */
export default function PropertyImagesDialog({
  property,
  onImagesChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<PropertyImage[]>(() =>
    normalizeImages(property.images),
  );
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const remaining = MAX_PROPERTY_IMAGES - images.length;
  const busy = uploading || busyId !== null;

  function commit(next: PropertyImage[]) {
    setImages(next);
    onImagesChange?.(property.id, next);
  }

  async function handleUpload() {
    if (files.length === 0) return;

    const payload = new FormData();
    files.forEach((file) => payload.append("images", file));

    try {
      setUploading(true);

      const result = await uploadPropertyImages(property.id, payload);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setFiles([]);

      if (result.images) {
        commit(result.images);
      } else {
        // The response did not include the new URLs; reload to show them.
        window.location.reload();
      }
    } catch (error) {
      console.error("Upload images error:", error);
      toast.error("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSetCover(imageId: string) {
    try {
      setBusyId(imageId);

      const result = await setPropertyCoverImage(property.id, imageId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      commit(
        result.images ??
          images
            .map((image) => ({ ...image, isCover: image.id === imageId }))
            .sort((a, b) => Number(b.isCover) - Number(a.isCover)),
      );
    } catch (error) {
      console.error("Set cover error:", error);
      toast.error("Failed to set the cover image.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(image: PropertyImage) {
    if (!window.confirm("Delete this photo?")) return;

    try {
      setBusyId(image.id);

      const result = await deletePropertyImage(property.id, image.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      if (result.images) {
        commit(result.images);
      } else {
        const rest = images.filter((item) => item.id !== image.id);

        if (image.isCover && rest.length > 0) {
          rest[0] = { ...rest[0], isCover: true };
        }

        commit(rest);
      }
    } catch (error) {
      console.error("Delete image error:", error);
      toast.error("Failed to delete the image.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-sm p-2 text-muted-foreground transition-colors duration-150 ease-out hover:bg-secondary hover:text-foreground"
        title="Manage photos"
      >
        <Images className="h-4 w-4" />
      </button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!busy) setOpen(next);
        }}
      >
        <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
          <DialogHeader className="border-b border-line px-6 py-4">
            <DialogTitle>Photos</DialogTitle>

            <DialogDescription>
              Manage the photos for {property.title}. The cover photo is
              shown on listing cards.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-6 py-5">
            {images.length === 0 ? (
              <p className="rounded-sm border border-line bg-secondary/40 px-4 py-6 text-center text-sm text-muted-foreground">
                This property has no photos yet.
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((image) => (
                  <li
                    key={image.id}
                    className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line bg-secondary"
                  >
                    <Image
                      src={image.url}
                      alt={`${property.title} photo`}
                      fill
                      sizes="(min-width: 640px) 200px, 50vw"
                      className="object-cover"
                    />

                    {image.isCover && (
                      <span className="absolute left-1.5 top-1.5 rounded-sm bg-primary px-1.5 py-0.5 text-[11px] font-medium text-primary-foreground">
                        Cover
                      </span>
                    )}

                    <div className="absolute right-1.5 top-1.5 flex gap-1">
                      {!image.isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(image.id)}
                          disabled={busy}
                          className="rounded-full bg-background/90 p-1.5 text-foreground shadow-sm hover:bg-background disabled:opacity-50"
                          title="Make cover"
                        >
                          <Star className="h-3.5 w-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(image)}
                        disabled={busy}
                        className="rounded-full bg-background/90 p-1.5 text-destructive shadow-sm hover:bg-background disabled:opacity-50"
                        title="Delete photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-3 border-t border-line pt-5">
              <h3 className="text-sm font-medium">Add photos</h3>

              <ImageFilePicker
                id={`images-${property.id}`}
                files={files}
                onChange={setFiles}
                max={remaining}
                disabled={busy}
              />
            </div>
          </div>

          <DialogFooter className="border-t border-line px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={busy}
            >
              Close
            </Button>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={busy || files.length === 0}
            >
              {uploading
                ? "Uploading"
                : `Upload ${files.length || ""} photo${files.length === 1 ? "" : "s"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
