"use client";

import { useCallback, useState } from "react";
import { Upload, Camera, ImageIcon, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
  processingLabel?: string;
}

export function UploadZone({ onFileSelected, isProcessing, processingLabel }: UploadZoneProps) {
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
        <div className="relative overflow-hidden rounded-lg border border-border">
          <img
            src={preview}
            alt="Product preview"
            className={cn(
              "w-full max-h-80 object-contain bg-black/30 transition-all duration-700",
              isProcessing && "opacity-30 scale-[1.02]"
            )}
          />
          {isProcessing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="absolute inset-0 scanline" />
              <div className="relative size-14 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-accent/30 animate-pulse-ring" />
                <div className="absolute inset-2 rounded-full border border-accent/50 animate-spin-slow" />
                <Crosshair className="size-5 text-accent" />
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-xs font-medium tracking-wide text-foreground">
                  {processingLabel || "Scanning"}
                </p>
                <div className="flex items-center gap-1 justify-center">
                  <span className="size-1 rounded-full bg-accent animate-pulse" />
                  <span className="size-1 rounded-full bg-accent animate-pulse" style={{ animationDelay: "200ms" }} />
                  <span className="size-1 rounded-full bg-accent animate-pulse" style={{ animationDelay: "400ms" }} />
                </div>
              </div>
              <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent animate-scan-line" />
            </div>
          )}
          {!isProcessing && (
            <button
              onClick={() => {
                setPreview(null);
              }}
              className="absolute top-3 right-3 rounded-md border border-border bg-background/90 px-3 py-1.5 text-[11px] font-medium tracking-wide backdrop-blur-sm transition-colors hover:bg-accent/10 hover:border-accent/30"
            >
              Change
            </button>
          )}
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-5 rounded-lg border p-10 sm:p-14 transition-all duration-200",
            isDragging
              ? "border-accent bg-accent/5 shadow-[0_0_20px_-5px] shadow-accent/20"
              : "border-border hover:border-accent/30 hover:bg-accent/[0.02]"
          )}
        >
          <div
            className={cn(
              "flex size-14 items-center justify-center rounded-lg border transition-colors",
              isDragging
                ? "border-accent/40 bg-accent/10"
                : "border-border"
            )}
          >
            {isDragging ? (
              <Upload className="size-5 text-accent" />
            ) : (
              <ImageIcon className="size-5 text-muted-foreground" />
            )}
          </div>
          <div className="text-center space-y-1.5">
            <p className="text-sm font-medium tracking-wide">
              {isDragging ? "Drop image here" : "Upload product photo"}
            </p>
            <p className="text-[12px] text-muted-foreground">
              Clear photo of the product label with ISI markings
            </p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
              <Camera className="size-3.5" />
              Camera
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
              <Upload className="size-3.5" />
              Browse
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
