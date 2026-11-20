"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

import {
  ALLOWED_IMAGE_TYPES,
  validateImageFile,
} from "@/lib/propertyImages";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  /** How many more images the property can take. */
  max: number;
  disabled?: boolean;
  id?: string;
};

/**
 * Picks image files and previews them before upload. Files are checked
 * against the backend's limits (type, 5 MB, count) as they are chosen, so the
 * landlord finds out straight away rather than after the upload fails.
 */
export default function ImageFilePicker({
  files,
  onChange,
  max,
  disabled,
  id = "images",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Previews are data URLs keyed by file, so there are no object URLs to
  // revoke and a Strict Mode effect re-run cannot leave a broken preview.
  const [previews, setPreviews] = useState<Map<File, string>>(new Map());

  useEffect(() => {
    let cancelled = false;

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (cancelled || typeof reader.result !== "string") return;

        const src = reader.result;

        setPreviews((current) => new Map(current).set(file, src));
      };

      reader.readAsDataURL(file);
    });

    return () => {
      cancelled = true;
    };
  }, [files]);

  function handleSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(event.target.files ?? []);
    event.target.value = "";

    const accepted: File[] = [];

    for (const file of chosen) {
      const error = validateImageFile(file);

      if (error) {
        toast.error(error);
        continue;
      }

      accepted.push(file);
    }

    const room = max - files.length;

    if (accepted.length > room) {
      toast.error(
        room > 0
          ? `Only ${room} more image${room === 1 ? "" : "s"} can be added.`
          : "This property already has the maximum of 10 images.",
      );
    }

    if (room > 0 && accepted.length > 0) {
      onChange([...files, ...accepted.slice(0, room)]);
    }
  }

  function removeAt(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  const full = files.length >= max;

  return (
    <div className="space-y-3">
      {files.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-sm border border-line bg-secondary"
            >
              {previews.get(file) && (
                // eslint-disable-next-line @next/next/no-img-element -- local file preview
                <img
                  src={previews.get(file)}
                  alt={file.name}
                  className="h-full w-full object-cover"
                />
              )}

              <button
                type="button"
                onClick={() => removeAt(index)}
                disabled={disabled}
                className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground shadow-sm hover:bg-background"
                title="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        multiple
        hidden
        onChange={handleSelect}
        disabled={disabled || full}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || full}
        className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-border px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ImagePlus className="h-4 w-4" />
        {full ? "Image limit reached" : "Choose images"}
      </button>

      <p className="text-xs text-muted-foreground">
        JPEG, PNG, WebP or AVIF, up to 5 MB each. {files.length} of {max}{" "}
        selected. The first image becomes the cover.
      </p>
    </div>
  );
}
