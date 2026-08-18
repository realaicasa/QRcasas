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
    Password_Hash: { id: "Password_Hash", real: "Password Hash", fieldId: "fldryw6Tmt4U6gj5n5k", type: "text", camel: "passwordHash" },
    Password_Reset_Token: { id: "Password_Reset_Token", real: "Password Reset Token", fieldId: "fld25uArqAK3dQZQ59y", type: "text", camel: "passwordResetToken" },
    Password_Reset_Expires: { id: "Password_Reset_Expires", real: "Password Reset Expires", fieldId: "fldAqjKQgJomrHbOjvV", type: "date", camel: "passwordResetExpires" },
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
    Profile_Photo: { id: "Profile_Photo", real: "Profile Photo", fieldId: "fldx4W6ZEhSV29zqJYV", type: "attachment", camel: "profilePhoto" },
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
    Agent_Reference: { id: "Agent_Reference", real: "Agent Reference", fieldId: "flduxURDcK1d5I44vND", type: "text", camel: "agentReference" },
    Featured_Agent: { id: "Featured_Agent", real: "Featured Agent", fieldId: "fld1XFy2E17pOrkTGcR", type: "checkbox", camel: "featuredAgent" },
    Identity_Verification_Status: { id: "Identity_Verification_Status", real: "Identity Verification Status", fieldId: "fldgeVZTl4rVKO5ztpj", type: "singleSelect", camel: "identityVerificationStatus" },
    Verification_Fee_Active: { id: "Verification_Fee_Active", real: "Verification Fee Active", fieldId: "fld2qEH7AEfeZDTLAZb", type: "checkbox", camel: "verificationFeeActive" },
    Specialist_Vocation: { id: "Specialist_Vocation", real: "Specialist Vocation", fieldId: "fldRCiN3ni2LVV4gaHG", type: "singleSelect", camel: "specialistVocation" },
    Public_WhatsApp: { id: "Public_WhatsApp", real: "Public WhatsApp", fieldId: "fldzHwStmleEW4iVxK1", type: "text", camel: "publicWhatsApp" },
    Public_Email: { id: "Public_Email", real: "Public Email", fieldId: "fldQ7TBxCJDMGsNzMtz", type: "text", camel: "publicEmail" },
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
    Photo_Alt_Text: { id: "Photo_Alt_Text", real: "Photo Alt Text", fieldId: "fldbhHkDF3bkdJ7CZI2", type: "longText", camel: "photoAltText" },
    Photo_Package: { id: "Photo_Package", real: "Photo Package", fieldId: "fldXskmOlaJbHXIbYjW", type: "singleSelect", camel: "photoPackage" },
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
    Pet_Friendly: { id: "Pet_Friendly", real: "Pet Friendly", fieldId: "fldX3kvncUIw0KMu47G", type: "checkbox", camel: "petFriendly" },
    Parking: { id: "Parking", real: "Parking", fieldId: "fldLlRq74M1z3X6Z83j", type: "checkbox", camel: "parking" },
    Near_Shopping: { id: "Near_Shopping", real: "Near Shopping", fieldId: "fldcgQOZdfKA4LVkNEv", type: "checkbox", camel: "nearShopping" },
    Near_Jungle: { id: "Near_Jungle", real: "Near Jungle", fieldId: "fldwENpEJo5epoUMmKb", type: "checkbox", camel: "nearJungle" },
    Near_Beach: { id: "Near_Beach", real: "Near Beach", fieldId: "fldcuo2Z37aEj3vtwHA", type: "checkbox", camel: "nearBeach" },
    TwentyFour_Hour_Security: { id: "TwentyFour_Hour_Security", real: "24 Hour Security", fieldId: "fldwPxYvCnIkLBxPcQH", type: "checkbox", camel: "twentyFourHourSecurity" },
    Listing_Starts_At: { id: "Listing_Starts_At", real: "Listing Starts At", fieldId: "fld7voRNUDf1v9QwDQx", type: "date", camel: "listingStartDate" },
    Paid_Through: { id: "Paid_Through", real: "Paid Through", fieldId: "fldz0aomJ2W1kqBn8W7", type: "date", camel: "listingExpiryDate" },
    Renewal_Reminder_Sent_At: { id: "Renewal_Reminder_Sent_At", real: "Renewal Reminder Sent At", fieldId: "fld9kneETPhsPHLkrKg", type: "date", camel: "reminderSentAt" },
    Purge_Eligible_At: { id: "Purge_Eligible_At", real: "Purge Eligible At", fieldId: "fldxoXErVbAiVTQgRdY", type: "date", camel: "archiveUntilDate" },
    Lifecycle_Status: { id: "Lifecycle_Status", real: "Lifecycle Status", fieldId: "flda9iYZk8ktSjprlp2", type: "singleSelect", camel: "lifecycleState" },
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

  Locations: {
    __id: RECORD_FIELD,
    Location: { id: "Location", real: "Location", fieldId: "fldnNcucaVDrNHGdCQ3", type: "text", camel: "location" },
    Type: { id: "Type", real: "Type", fieldId: "fldRjWJcVDF911q1YD9", type: "singleSelect", camel: "type" },
    Slug: { id: "Slug", real: "Slug", fieldId: "fldQvjIXcSafSDsD4fx", type: "text", camel: "slug" },
    Public_Label: { id: "Public_Label", real: "Public Label", fieldId: "fldfb4g8XvT4E3QNZDW", type: "text", camel: "publicLabel" },
    Active: { id: "Active", real: "Active", fieldId: "flduPZ6Vo7nrkkcPH03", type: "checkbox", camel: "active" },
    Parent_Location: { id: "Parent_Location", real: "Parent Location", fieldId: "fld4A1eC3BxcIgIZ0Gf", type: "link", camel: "parentLocation" },
  },

Property_Activity: {
    __id: RECORD_FIELD,
    Activity: { id: "Activity", real: "Activity", fieldId: "fld5QW0BvXYWiwG4vV4", type: "text", camel: "activity" },
    Event_Type: { id: "Event_Type", real: "Event Type", fieldId: "fldWF2afOD5CxjcPbbh", type: "singleSelect", camel: "eventType" },
    Source: { id: "Source", real: "Source", fieldId: "fldc4dMJXSswD0Mi01g", type: "singleSelect", camel: "source" },
    Session_ID: { id: "Session_ID", real: "Session ID", fieldId: "fldYkIZwf5cb83X2ZiF", type: "text", camel: "sessionId" },
    Language: { id: "Language", real: "Language", fieldId: "fldzniSWdlpaHInhq7A", type: "singleSelect", camel: "language" },
    User: { id: "User", real: "User", fieldId: "fldchSgkq0bhjSRFtFF", type: "link", camel: "user" },
    Property: { id: "Property", real: "Property", fieldId: "fld1lOe9O3BisdaEXa0", type: "link", camel: "property" },
    Advertiser: { id: "Advertiser", real: "Advertiser", fieldId: "fldSChAn15nDORBnKNh", type: "link", camel: "advertiser" },
    Created: { id: "Created", real: "Created", fieldId: "fldE3vEdg6WPaYAqDO7", type: "createdTime" },
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

  ListingRenewals: {
    __id: RECORD_FIELD,
    Renewal: { id: "Renewal", real: "Renewal", fieldId: "fld5aMRLFH1n4G9kMCD", type: "text", camel: "renewal" },
    Term: { id: "Term", real: "Term", fieldId: "fldSOGOgnOjGEZUseJb", type: "singleSelect", camel: "term" },
    Status: { id: "Status", real: "Status", fieldId: "fldIsTaV3ZtdL1umPwu", type: "singleSelect", camel: "status" },
    Starts_At: { id: "Starts_At", real: "Starts At", fieldId: "fldvcamWZAdvn9v5dh5", type: "date", camel: "startsAt" },
    Ends_At: { id: "Ends_At", real: "Ends At", fieldId: "fldP0gayb30wgisr7XA", type: "date", camel: "endsAt" },
    Paid_At: { id: "Paid_At", real: "Paid At", fieldId: "fld28I2xZev2DwJ8A6D", type: "date", camel: "paidAt" },
    Amount: { id: "Amount", real: "Amount", fieldId: "fldR5B8yRC3F760ue9H", type: "number", camel: "amount" },
    Currency: { id: "Currency", real: "Currency", fieldId: "fldYJSIj13Z1nWMh0AH", type: "singleSelect", camel: "currency" },
    Stripe_Checkout_Session_ID: { id: "Stripe_Checkout_Session_ID", real: "Stripe Checkout Session ID", fieldId: "fldQT1WyDtLAHiKwWlR", type: "text", camel: "stripeCheckoutSessionId" },
    Stripe_Subscription_ID: { id: "Stripe_Subscription_ID", real: "Stripe Subscription ID", fieldId: "fldBmnY1Otq3Bp01dPb", type: "text", camel: "stripeSubscriptionId" },
    Introducer_Coupon: { id: "Introducer_Coupon", real: "Introducer Coupon", fieldId: "fldaJY2AI2wrvV4oDVD", type: "text", camel: "introducerCoupon" },
    Affiliate_Reference: { id: "Affiliate_Reference", real: "Affiliate Reference", fieldId: "fldirovnULfx04A0ZQE", type: "text", camel: "affiliateReference" },
    Property: { id: "Property", real: "Property", fieldId: "fldv5j3sOmvkGGj7cpS", type: "link", camel: "property" },
    Advertiser: { id: "Advertiser", real: "Advertiser", fieldId: "flddYpbtwOoWI9VPaql", type: "link", camel: "advertiser" },
    Package: { id: "Package", real: "Package", fieldId: "fldjKuKFJgcMAmbE0EC", type: "singleSelect", camel: "package" },
    Property_Count: { id: "Property_Count", real: "Property Count", fieldId: "fldyA1dD5dBlA6ywbdx", type: "number", camel: "propertyCount" },
    Properties: { id: "Properties", real: "Properties", fieldId: "fld1MUwhawyO2BC2Uzw", type: "link", camel: "properties" },
    Photo_Add_on: { id: "Photo_Add_on", real: "Photo Add-on", fieldId: "fld28uubAknAtmRlaY7", type: "singleSelect", camel: "photoAddOn" },
    Photo_Add_on_Amount: { id: "Photo_Add_on_Amount", real: "Photo Add-on Amount", fieldId: "fldF8CQe5VKIF7YjprA", type: "number", camel: "photoAddOnAmount" },
    Created: { id: "Created", real: "Created", fieldId: "fldg7fty8YFTX3AgCqx", type: "createdTime" },
    Updated: { id: "Updated", real: "Last Updated", fieldId: "fldXndK2DW7q25f8eS2", type: "lastModifiedTime" },
  },
};
