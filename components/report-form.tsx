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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { MapPin, Send, CheckCircle2 } from "lucide-react";

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
      <Card className="ring-emerald-500/20">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="size-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold">Report Submitted</h3>
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Thank you for contributing to consumer safety. Your report is now
            part of the community intelligence.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <MapPin className="size-5" />
          <CardTitle>Submit Report</CardTitle>
        </div>
        <CardDescription>
          Add location details to contribute this scan to the community map.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="shopName">Shop name (optional)</Label>
            <Input
              id="shopName"
              placeholder="e.g. Sharma General Store"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="e.g. Srinagar"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>State *</Label>
              <Select value={state} onValueChange={setState} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Additional notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any other details about where you found this product..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!city || !state || isSubmitting}
          >
            <Send className="size-4 mr-1.5" />
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
