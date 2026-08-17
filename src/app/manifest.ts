import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QRcasas - Quintana Roo Real Estate Marketplace",
    short_name: "QRcasas",
    description:
      "Bilingual real estate advertising and introduction platform focused on Quintana Roo, Mexico.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fafaf9",
    theme_color: "#0e7490",
    categories: ["real_estate", "shopping", "business"],
    icons: [
      { src: "https://assets.cdn.filesafe.space/oeYXQCzN3HPGG5vykVUG/media/6a837df9270e1f545777782d.png", sizes: "192x192", type: "image/png" },
      { src: "https://assets.cdn.filesafe.space/oeYXQCzN3HPGG5vykVUG/media/6a837df9b9deff193c5bd67.png", sizes: "512x512", type: "image/png" },
      {
        src: "https://assets.cdn.filesafe.space/oeYXQCzN3HPGG5vykVUG/media/6a837df9270e1f545777782d.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "https://assets.cdn.filesafe.space/oeYXQCzN3HPGG5vykVUG/media/6a837df9b9deff193c5bd67.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Browse properties",
        short_name: "Properties",
        url: "/en/properties",
        icons: [{ src: "https://assets.cdn.filesafe.space/oeYXQCzN3HPGG5vykVUG/media/6a837df9270e1f545777782d.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Find a realtor",
        short_name: "Realtors",
        url: "/en/directory",
      },
    ],
  };
}