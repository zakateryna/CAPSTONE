import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ArchivePage from "./pages/ArchivePage";
import CartPage from "./pages/CartPage";
import ShopPage from "./pages/ShopPage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsAndConditions";
import PrivacyPage from "./pages/PrivacyPolicy";

function normalizePhotos(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.photos)) return payload.photos;
  return [];
}

function normalizeProductTypes(payload) {
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    if (Array.isArray(payload.items)) {
      const map = {};
      for (const item of payload.items) {
        if (item?.key) map[item.key] = item;
      }
      return Object.keys(map).length ? map : null;
    }

    if (payload.NOTEBOOK || payload.POSTER || payload.MUG || payload.TOTE) {
      return payload;
    }
  }
  return null;
}

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [productTypes, setProductTypes] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [photosRes, typesRes] = await Promise.all([
          fetch("/api/photos"),
          fetch("/api/product-types"),
        ]);

        if (!photosRes.ok) throw new Error(`PHOTOS_HTTP_${photosRes.status}`);
        if (!typesRes.ok) throw new Error(`TYPES_HTTP_${typesRes.status}`);

        const photosData = await photosRes.json();
        const typesData = await typesRes.json();

        const list = normalizePhotos(photosData);
        const types = normalizeProductTypes(typesData);

        if (!cancelled) {
          setPhotos(list);
          setProductTypes(types);
        }
      } catch (err) {
        console.error("Catalog load error:", err);
        if (!cancelled) {
          setPhotos([]);
          setProductTypes(null);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-mono bg-[#F2E8DA] text-[#5D172E]">
      <Header />

<div className="flex-1">
      <Routes>
        <Route path="/" element={<HomePage photos={photos} />} />
        <Route
          path="/shop"
          element={<ShopPage photos={photos} productTypes={productTypes} />}
        />
        <Route
          path="/archive"
          element={<ArchivePage photos={photos} productTypes={productTypes} />}
        />
        <Route path="/about" element={<AboutPage photos={photos} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>
</div>

      <Footer />
    </div>
  );
}