"use client";

import { useCallback, useState } from "react";
import { Upload, Camera, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
}

export function UploadZone({ onFileSelected, isProcessing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="relative">
      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/20">
          <img
            src={preview}
            alt="Product preview"
            className={cn(
              "w-full max-h-80 object-contain bg-muted/30 transition-all duration-500",
              isProcessing && "opacity-60 blur-[1px]"
            )}
          />
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-sm">
              <div className="relative size-12">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <Camera className="absolute inset-0 m-auto size-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground/80">
                Scanning product label...
              </p>
            </div>
          )}
          {!isProcessing && (
            <button
              onClick={() => {
                setPreview(null);
              }}
              className="absolute top-3 right-3 rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors hover:bg-background"
            >
              Change photo
            </button>
          )}
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/30"
          )}
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
            {isDragging ? (
              <Upload className="size-7 text-primary animate-bounce" />
            ) : (
              <ImageIcon className="size-7 text-primary" />
            )}
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-foreground">
              {isDragging ? "Drop your image here" : "Upload a product photo"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Take a clear photo of the product label with ISI markings
            </p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Camera className="size-3" />
              Camera
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Upload className="size-3" />
              Browse files
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
