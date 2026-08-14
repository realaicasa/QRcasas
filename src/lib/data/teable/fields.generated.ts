// Real Teable field maps, captured from /api/table/{tableId}/field on 2026-08-14.
// `id` is the app-level identifier used in SQL and create/update payloads.
// `real` is the real Teable field name; `fieldId` the Teable field id (used in filters/orderBy).
// `type` drives operator/value shapes. `camel` is the camelCase alias used by update helpers.
// `enumIn`/`enumOut` convert between app values and the exact singleSelect choice labels.

export type TeableFieldType =
  | "record"
  | "text"
  | "longText"
  | "number"
  | "checkbox"
  | "link"
  | "singleSelect"
  | "attachment"
  | "createdTime"
  | "lastModifiedTime"
  | "date";

export interface FieldMeta {
  id: string;
  real: string;
  fieldId: string;
  type: TeableFieldType;
  camel?: string;
  enumIn?: Record<string, string>;
  enumOut?: Record<string, string>;
}

const RECORD_FIELD: FieldMeta = { id: "__id", real: "__id", fieldId: "__id", type: "record" };

export const FIELDS: Record<string, Record<string, FieldMeta>> = {
  Users: {
    __id: RECORD_FIELD,
    Email: { id: "Email", real: "Email", fieldId: "fldeG7T5Yndw4yzVGXG", type: "text", camel: "email" },
    Preferred_Language: {
      id: "Preferred_Language",
      real: "Preferred Language",
      fieldId: "fldGQhCaHFXDdLz6O40",
      type: "singleSelect",
      camel: "preferredLanguage",
      enumIn: { en: "English", es: "Spanish" },
      enumOut: { English: "en", Spanish: "es" },
    },
    Is_Verified: { id: "Is_Verified", real: "Active", fieldId: "fldTkFh6E2HvLSzImkq", type: "checkbox", camel: "isVerified" },
    Created: { id: "Created", real: "Created", fieldId: "fldseko4r2iaAPe1C6B", type: "createdTime" },
    Updated: { id: "Updated", real: "Last Updated", fieldId: "fldkU5nKMz1caRtNBto", type: "lastModifiedTime" },
  },

  Agents: {
    __id: RECORD_FIELD,
    Business_Name: { id: "Business_Name", real: "Client Name", fieldId: "fldASbSaxIuY9G8s0Vt", type: "text", camel: "businessName" },
    Tier_Level: {
      id: "Tier_Level",
      real: "Directory Tier",
      fieldId: "fldGJgChxDMFfGj1Ytm",
      type: "singleSelect",
      camel: "tierLevel",
      enumIn: { Pro_Plus: "Pro Plus" },
      enumOut: { "Pro Plus": "Pro_Plus" },
    },
    Primary_Contact_Channel: {
      id: "Primary_Contact_Channel",
      real: "Primary Contact Channel",
      fieldId: "fldm2LKwYCEyv9WzHxx",
      type: "singleSelect",
      camel: "primaryContactChannel",
    },
    Primary_Contact_Value: {
      id: "Primary_Contact_Value",
      real: "Primary Contact Value",
      fieldId: "fldymDfVgUSH9wLTBnn",
      type: "text",
      camel: "primaryContactValue",
    },
    Default_Language: {
      id: "Default_Language",
      real: "Default Language",
      fieldId: "fldI3c68dqeef4g68NB",
      type: "singleSelect",
      camel: "defaultLanguage",
      enumIn: { en: "English", es: "Spanish" },
      enumOut: { English: "en", Spanish: "es" },
    },
    Logo_Image: { id: "Logo_Image", real: "Realtor Logo", fieldId: "fld6ugy4EQy1HQyseVg", type: "attachment", camel: "logoImage" },
    Bio_Description: { id: "Bio_Description", real: "Public About", fieldId: "fldu3RWgnQjwnrQNHjK", type: "longText", camel: "bioDescription" },
    Social_Instagram: { id: "Social_Instagram", real: "Instagram URL", fieldId: "fld3rwy2RSUzQTcOgCd", type: "text", camel: "socialInstagram" },
    Social_Facebook: { id: "Social_Facebook", real: "Facebook URL", fieldId: "fldXMyfDPG8f6cgjri2", type: "text", camel: "socialFacebook" },
    Social_LinkedIn: { id: "Social_LinkedIn", real: "LinkedIn URL", fieldId: "fldNy2Es5IPCp9v7J9Q", type: "text", camel: "socialLinkedIn" },
    Website_URL: { id: "Website_URL", real: "Website", fieldId: "fldJYbMN8xhPlJu3v68", type: "text", camel: "websiteUrl" },
    Custom_Slug: { id: "Custom_Slug", real: "Realtor Site Slug", fieldId: "fldUfkzpO1wKjf1kSNn", type: "text", camel: "customSlug" },
    SEO_Title: { id: "SEO_Title", real: "SEO Title EN", fieldId: "fldD4472wEFQFNkCHTd", type: "text", camel: "seoTitle" },
    SEO_Description: { id: "SEO_Description", real: "SEO Description EN", fieldId: "fld2sbDcIjPNIDap0jK", type: "longText", camel: "seoDescription" },
    SEO_Keywords: { id: "SEO_Keywords", real: "SEO Keywords", fieldId: "fldBpiFhMfQvAdsMIeP", type: "text", camel: "seoKeywords" },
    Is_Verified: { id: "Is_Verified", real: "Directory Published", fieldId: "fldapJc9upd7yxONvrJ", type: "checkbox", camel: "isVerified" },
    User: { id: "User", real: "Portal Users", fieldId: "fldXRTqCjvtii8I1oWC", type: "link" },
    Display_Name: { id: "Display_Name", real: "Realtor Display Name", fieldId: "fldgd8HQWUX6IghnYLN", type: "text" },
    Tagline: { id: "Tagline", real: "Public Tagline", fieldId: "fldYySlqezswm1WTUFY", type: "text", camel: "tagline" },
    Logo: { id: "Logo", real: "Realtor Logo", fieldId: "fld6ugy4EQy1HQyseVg", type: "attachment" },
    Identity_Verified: { id: "Identity_Verified", real: "Directory Published", fieldId: "fldapJc9upd7yxONvrJ", type: "checkbox" },
    Created: { id: "Created", real: "Created", fieldId: "fld3r7WBZLiFM0MMARc", type: "createdTime" },
    Updated: { id: "Updated", real: "Last Updated", fieldId: "fld6cj9Ldg6pK5e9yRr", type: "lastModifiedTime" },
  },

  Properties: {
    __id: RECORD_FIELD,
    Public_Slug: { id: "Public_Slug", real: "Public Slug", fieldId: "fldetPkUUooC9OnNom2", type: "text", camel: "slug" },
    Title: { id: "Title", real: "Property", fieldId: "fldI51wMUaGS8QK3Lxt", type: "text", camel: "title" },
    Property: { id: "Property", real: "Property", fieldId: "fldI51wMUaGS8QK3Lxt", type: "text" },
    Description: { id: "Description", real: "Description", fieldId: "fldf1BvYYZzGd8gb9rO", type: "longText", camel: "description" },
    Key_Features: { id: "Key_Features", real: "Key Features", fieldId: "fldJZ6F0n3sA3rTiehu", type: "longText", camel: "keyFeatures" },
    Price: { id: "Price", real: "Price", fieldId: "fldVeohUjOCsh9OlQFl", type: "number", camel: "price" },
    Currency: { id: "Currency", real: "Currency", fieldId: "fldGc15jR4Vu1qT0Bsl", type: "singleSelect", camel: "currency" },
    Listing_Type: { id: "Listing_Type", real: "Listing Type", fieldId: "fldEVUI6QhtiC7cjb4K", type: "singleSelect", camel: "listingType" },
    Listing_Term: { id: "Listing_Term", real: "Listing Term", fieldId: "fldhgnAgrqRbjPBNpte", type: "singleSelect", camel: "listingTerm" },
    Bedrooms: { id: "Bedrooms", real: "Bedrooms", fieldId: "fldtwIHzgctgaBD2T6P", type: "number", camel: "bedrooms" },
    Bathrooms: { id: "Bathrooms", real: "Bathrooms", fieldId: "fldMnxiTKFfmxtjJUJx", type: "number", camel: "bathrooms" },
    Interior_Area: { id: "Interior_Area", real: "Interior Area", fieldId: "fldi4FniMOkftAQwdss", type: "number", camel: "interiorArea" },
    Area_Unit: { id: "Area_Unit", real: "Area Unit", fieldId: "fldoToNti6odY2nKrQK", type: "singleSelect", camel: "areaUnit" },
    Photos: { id: "Photos", real: "Photos", fieldId: "flddQnBjD5EOywUaeOe", type: "attachment", camel: "photos" },
    Public_Location: { id: "Public_Location", real: "Public Location", fieldId: "fldLICiVU3pUzIcIuXV", type: "text", camel: "publicLocation" },
    Latitude: { id: "Latitude", real: "Latitude", fieldId: "fldI8j0PH6RncCWpKTp", type: "number", camel: "latitude" },
    Longitude: { id: "Longitude", real: "Longitude", fieldId: "fld4ydJAdKXFmThoj6c", type: "number", camel: "longitude" },
    Featured: { id: "Featured", real: "Featured", fieldId: "fldVSev63gohQaW0hBL", type: "checkbox", camel: "featured" },
    Verified: { id: "Verified", real: "Published", fieldId: "fldhkAb4KYn1IZmwLib", type: "checkbox", camel: "verified" },
    Published: { id: "Published", real: "Published", fieldId: "fldhkAb4KYn1IZmwLib", type: "checkbox" },
    Wi_Fi: { id: "Wi_Fi", real: "WiFi", fieldId: "fld8qzQAkh0HfFz8vcJ", type: "checkbox", camel: "wifi" },
    Elevator: { id: "Elevator", real: "Elevator", fieldId: "fldQ7F8yMKTKxcMP5pM", type: "checkbox", camel: "elevator" },
    Pool: { id: "Pool", real: "Pool", fieldId: "fldsXsTw5R05ERJWSQK", type: "singleSelect", camel: "pool" },
    Furnished: { id: "Furnished", real: "Furnished", fieldId: "fld2onaAmqr0i2K6Xmz", type: "singleSelect", camel: "furnished" },
    Laundry: { id: "Laundry", real: "Laundry", fieldId: "fld31nOVYI2V9lGoNJA", type: "singleSelect", camel: "laundry" },
    City: { id: "City", real: "City", fieldId: "fldgyInMmPEsw4knJNC", type: "link" },
    Area: { id: "Area", real: "Area", fieldId: "fldmmdNC3U5KKGB2SI3", type: "link" },
    Development: { id: "Development", real: "Development", fieldId: "fldFVvRu2QMZC5bA2Cu", type: "link" },
    Client: { id: "Client", real: "Client", fieldId: "fldCjyWOwml33IimUm6", type: "link" },
    SEO_Title: { id: "SEO_Title", real: "SEO Title EN", fieldId: "fldOHjm0s2UbkYUhgWw", type: "text", camel: "seoTitle" },
    SEO_Title_En: { id: "SEO_Title_En", real: "SEO Title EN", fieldId: "fldOHjm0s2UbkYUhgWw", type: "text", camel: "seoTitleEn" },
    SEO_Title_Es: { id: "SEO_Title_Es", real: "SEO Title ES", fieldId: "fldyyMja52utysBuX6P", type: "text", camel: "seoTitleEs" },
    SEO_Description: { id: "SEO_Description", real: "SEO Description EN", fieldId: "fld57mt2w4qxpkTAAU8", type: "text", camel: "seoDescription" },
    SEO_Description_En: { id: "SEO_Description_En", real: "SEO Description EN", fieldId: "fld57mt2w4qxpkTAAU8", type: "text", camel: "seoDescriptionEn" },
    SEO_Description_Es: { id: "SEO_Description_Es", real: "SEO Description ES", fieldId: "fld4tBeF7rPMJCRuzrf", type: "text", camel: "seoDescriptionEs" },
    SEO_Keywords: { id: "SEO_Keywords", real: "SEO Keywords", fieldId: "fldq5QMZMOi8NVOfk79", type: "text", camel: "seoKeywords" },
    Updated: { id: "Updated", real: "Last Updated", fieldId: "fldVvOfxFOLxw7mw29I", type: "lastModifiedTime", camel: "updatedAt" },
    Created: { id: "Created", real: "Created", fieldId: "fldTFwIxg1w393UvGbK", type: "createdTime" },
  },

  Property_Favorites: {
    __id: RECORD_FIELD,
    Favorite_Key: { id: "Favorite_Key", real: "Favorite Key", fieldId: "fldel3iS3SKScIulkZx", type: "text" },
    Active: { id: "Active", real: "Active", fieldId: "fldtt1vd3eRhFminwSb", type: "checkbox" },
    Source: { id: "Source", real: "Source", fieldId: "fldlWyBhHz0WtGFJ0wu", type: "singleSelect" },
    Created: { id: "Created", real: "Created", fieldId: "fldZyXfHiIokpf1Xshh", type: "createdTime" },
    Updated: { id: "Updated", real: "Last Updated", fieldId: "fldfjEJHXBbeyWwcf2U", type: "lastModifiedTime" },
    Property: { id: "Property", real: "Property", fieldId: "fldZSJvLZE5hVZkEVe2", type: "link" },
    User: { id: "User", real: "User", fieldId: "fldDAX4LFTwlFRQWhje", type: "link" },
  },

  Property_Watchlists: {
    __id: RECORD_FIELD,
    Watchlist: { id: "Watchlist", real: "Watchlist", fieldId: "fld72cjivSaUmKI9EVZ", type: "text" },
    Active: { id: "Active", real: "Active", fieldId: "fldW2esq8osxxuGcqQY", type: "checkbox" },
    Listing_Type: { id: "Listing_Type", real: "Listing Type", fieldId: "fld4KSH6nCatEERJlOq", type: "singleSelect" },
    Maximum_Price: { id: "Maximum_Price", real: "Maximum Price", fieldId: "fldPUjWL9VqGQqzgy1h", type: "number" },
    Currency: { id: "Currency", real: "Currency", fieldId: "fldK6LKjKXj5gVGyMJc", type: "singleSelect" },
    Minimum_Bedrooms: { id: "Minimum_Bedrooms", real: "Minimum Bedrooms", fieldId: "fld3TNAFqfYUwUycCSB", type: "number" },
    Minimum_Bathrooms: { id: "Minimum_Bathrooms", real: "Minimum Bathrooms", fieldId: "fldJPCB01qz55JzC1Ji", type: "number" },
    Property_Type: { id: "Property_Type", real: "Property Type", fieldId: "fldMJ6m9EXeOVLBl95j", type: "singleSelect" },
    Furnished: { id: "Furnished", real: "Furnished", fieldId: "fldbywWXoh2CKJoH3pE", type: "singleSelect" },
    Elevator_Required: { id: "Elevator_Required", real: "Elevator Required", fieldId: "fldAX1jctLvRR4OZd7m", type: "checkbox" },
    WiFi_Required: { id: "WiFi_Required", real: "WiFi Required", fieldId: "fld5rgnTnpCO5PPKLwd", type: "checkbox" },
    Pool: {
      id: "Pool",
      real: "Pool",
      fieldId: "fldZnmmI3UQ4S0frzbK",
      type: "singleSelect",
      enumIn: { Yes: "Private" },
    },
    Notification_Frequency: {
      id: "Notification_Frequency",
      real: "Notification Frequency",
      fieldId: "fldy8Jq7ycyFfBP56DF",
      type: "singleSelect",
      enumIn: { Daily: "Daily Digest" },
    },
    Last_Viewed_At: { id: "Last_Viewed_At", real: "Last Viewed At", fieldId: "fldsSy77dmyoSlYPzag", type: "date" },
    Created: { id: "Created", real: "Created", fieldId: "fldYgQEBrnK7EWPPJbr", type: "createdTime" },
    Updated: { id: "Updated", real: "Last Updated", fieldId: "fldOGtCkwCPcKSA18Iu", type: "lastModifiedTime" },
    User: { id: "User", real: "User", fieldId: "fldTIs1bYAwC1ACN3BL", type: "link" },
    City: { id: "City", real: "City", fieldId: "fldfJ5Ynf1sHqe1d4nO", type: "link" },
    Area: { id: "Area", real: "Area", fieldId: "fldgU7opGzPlAmZeAoa", type: "link" },
    Development: { id: "Development", real: "Development", fieldId: "fldM1i5Hvg75oYy6mgo", type: "link" },
  },
};