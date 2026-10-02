import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kökü açıkça bu projeye sabitliyoruz: aksi halde Turbopack üst dizinlerdeki
  // bir package-lock.json'u görüp kökü yanlış yerde arıyor ve uyarı basıyor.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
