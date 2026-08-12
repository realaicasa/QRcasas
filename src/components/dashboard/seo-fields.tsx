"use client";

import { useState } from "react";

interface SeoFieldsProps {
  /** Whether the user's tier allows editing SEO fields */
  hasAccess: boolean;
  /** Current tier level for upgrade nudge text */
  tierLevel: string;
  /** Current SEO field values */
  initialValues?: {
    seoTitle?: string | null;
    seoDescription?: string | null;
    seoKeywords?: string | null;
  };
  /** Called when user saves changes */
  onSave?: (values: {
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
  }) => void | Promise<void>;
}

export default function SeoFields({
  hasAccess,
  tierLevel,
  initialValues,
  onSave,
}: SeoFieldsProps) {
  const [seoTitle, setSeoTitle] = useState(initialValues?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(initialValues?.seoDescription ?? "");
  const [seoKeywords, setSeoKeywords] = useState(initialValues?.seoKeywords ?? "");
  const [saving, setSaving] = useState(false);

  if (!hasAccess) {
    return (
      <div className="border rounded-lg p-4 bg-muted/50">
        <h4 className="font-medium text-sm mb-1">Custom SEO Metadata</h4>
        <p className="text-xs text-muted-foreground">
          Upgrade to Pro or Pro-Plus to customize your Search Engine Meta Title, Meta Description, and Keywords.
        </p>
      </div>
    );
  }

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave({ seoTitle, seoDescription, seoKeywords });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <h4 className="font-medium text-sm">Custom SEO Metadata</h4>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Meta Title
        </label>
        <input
          type="text"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          placeholder="e.g. 3-Bed Luxury Condo in Aldea Zama | Tulum Listing"
          maxLength={60}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Recommended: 50-60 characters ({seoTitle.length}/60)
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Meta Description
        </label>
        <textarea
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          placeholder="e.g. Discover this turnkey 3-bedroom penthouse with private rooftop pool..."
          maxLength={160}
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Recommended: 150-160 characters ({seoDescription.length}/160)
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Keywords
        </label>
        <input
          type="text"
          value={seoKeywords}
          onChange={(e) => setSeoKeywords(e.target.value)}
          placeholder="e.g. tulum condo, aldea zama real estate, luxury listing"
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Comma-separated keywords for internal reference
        </p>
      </div>

      {onSave && (
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save SEO Settings"}
        </button>
      )}
    </div>
  );
}
