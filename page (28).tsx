import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ALIANCA",
    short_name: "ALIANCA",
    description: "Fortaleca sua fe. Proteja seu relacionamento.",
    start_url: "/hoje",
    display: "standalone",
    background_color: "#FFFDFC",
    theme_color: "#7A2348",
    icons: [
      {
        src: "/brand/alianca-logo.png",
        sizes: "any",
        type: "image/png"
      }
    ]
  };
}
