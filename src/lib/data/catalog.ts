import "server-only";

export interface CatalogEntry {
  id: string;
  name: string;
  type: string;
}

export interface CatalogProperty {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  currency: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
}

export async function getCatalogEntries(_type?: string): Promise<CatalogEntry[]> {
  return [];
}
