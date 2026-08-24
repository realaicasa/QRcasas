"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/properties/property-form";
import type { PropertyFormData, PropertyPhotoDraft } from "@/components/properties/property-form";
import type { PropertyRecord } from "@/lib/data/property";
import type { LocationOption } from "@/lib/data/locations";
import type { Locale } from "@/lib/i18n";

interface PropertyEditFlowProps {
  locale: Locale;
  property: PropertyRecord;
  tierLevel: string;
  locations: { city: LocationOption[]; area: LocationOption[]; development: LocationOption[] };
  onSubmit: (data: PropertyFormData) => void | Promise<void>;
}

export default function PropertyEditFlow({
  locale,
  property,
  tierLevel,
  locations,
  onSubmit,
}: PropertyEditFlowProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState<PropertyPhotoDraft[]>([]);

  const handleSubmit = async (data: PropertyFormData) => {
    await onSubmit(data);
    if (photos.length > 0) {
      for (const photo of photos) {
        const formData = new FormData();
        formData.append("recordId", property.id);
        formData.append("fieldId", "flddQnBjD5EOywUaeOe");
        formData.append("file", photo.file);
        if (photo.altText) formData.append("altText", photo.altText);
        try {
          await fetch("/api/uploads/attachment", { method: "POST", body: formData });
        } catch {
          // ignore individual photo failures
        }
      }
    }
    router.push(`/${locale}/account/properties`);
    router.refresh();
  };

  return (
    <PropertyForm
      locale={locale}
      property={property}
      tierLevel={tierLevel}
      locations={locations}
      onPhotosChange={setPhotos}
      onSubmit={handleSubmit}
    />
  );
}
