"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Send, CheckCircle2, Loader2 } from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

interface ReportFormProps {
  imageStorageId: Id<"_storage">;
  extraction: {
    productName: string;
    brandName?: string;
    productType?: string;
    isiNumber: string;
    extractedText?: string;
    confidence: number;
  };
  verification: {
    verdict: "verified" | "not_found" | "suspicious" | "needs_review";
    confidence: number;
  };
  onSubmitted: () => void;
}

export function ReportForm({
  imageStorageId,
  extraction,
  verification,
  onSubmitted,
}: ReportFormProps) {
  const submit = useMutation(api.reports.submit);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [shopName, setShopName] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !state) return;

    setIsSubmitting(true);
    try {
      await submit({
        imageStorageId,
        productName: extraction.productName,
        brandName: extraction.brandName,
        productType: extraction.productType,
        isiNumber: extraction.isiNumber,
        extractedText: extraction.extractedText,
        verdict: verification.verdict,
        confidence: verification.confidence,
        shopName: shopName || undefined,
        city,
        state,
        notes: notes || undefined,
      });
      setSubmitted(true);
      setTimeout(onSubmitted, 1500);
    } catch (error) {
      console.error("Failed to submit report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-verified/20 bg-verified/5 flex flex-col items-center justify-center py-12 gap-4 animate-fade-up">
        <div className="size-12 rounded-lg border border-verified/20 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 text-verified animate-check-draw"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="text-center space-y-1.5">
          <h3 className="text-sm font-bold tracking-wide">
            Report Submitted
          </h3>
          <p className="text-[12px] text-muted-foreground max-w-xs">
            Thank you for contributing to consumer safety. Your report is now
            part of the community intelligence.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border divide-y divide-border">
      <div className="flex items-center gap-3 p-4">
        <MapPin className="size-3.5 text-muted-foreground" />
        <div>
          <h3 className="text-xs font-medium tracking-wide">
            Submit Report
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Add location to contribute this scan to the community map
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="shopName"
              className="text-[11px] font-medium tracking-wide text-muted-foreground"
            >
              Shop name
              <span className="text-muted-foreground/40 ml-1">optional</span>
            </Label>
            <Input
              id="shopName"
              placeholder="e.g. Sharma General Store"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="h-9 text-xs bg-transparent rounded-lg border-border focus:border-accent/40 focus:ring-accent/20 placeholder:text-muted-foreground/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-[11px] font-medium tracking-wide text-muted-foreground"
              >
                City <span className="text-accent/60">*</span>
              </Label>
              <Input
                id="city"
                placeholder="e.g. Srinagar"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="h-9 text-xs bg-transparent rounded-lg border-border focus:border-accent/40 focus:ring-accent/20 placeholder:text-muted-foreground/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-medium tracking-wide text-muted-foreground">
                State <span className="text-accent/60">*</span>
              </Label>
              <Select value={state} onValueChange={setState} required>
                <SelectTrigger className="w-full h-9 text-xs bg-transparent rounded-lg border-border">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="text-[11px] font-medium tracking-wide text-muted-foreground"
            >
              Notes
              <span className="text-muted-foreground/40 ml-1">optional</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Any other details about where you found this product..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20 text-xs bg-transparent rounded-lg border-border focus:border-accent/40 focus:ring-accent/20 placeholder:text-muted-foreground/30 resize-none"
            />
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <Button
            type="submit"
            size="lg"
            className="w-full text-xs font-medium tracking-wide h-10 rounded-lg"
            disabled={!city || !state || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="size-3.5 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
