import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ArchivePage from "./pages/ArchivePage";
import CartPage from "./pages/CartPage";
import ShopPage from "./pages/ShopPage"
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsAndConditions";
import PrivacyPage from "./pages/PrivacyPolicy";

import { PHOTOS } from "./data/photos";

export default function App() {
  return (
    <div className="min-h-screen font-mono bg-[#F2E8DA] text-[#5D172E] pb-12">
      <Header />

     <Routes>
        <Route path="/" element={<HomePage photos={PHOTOS} />} />
        <Route path="/archive" element={<ArchivePage photos={PHOTOS} />} />
        <Route path="/shop" element={<ShopPage photos={PHOTOS} />} />
        <Route path="/about" element={<AboutPage photos={PHOTOS} />} />

        <Route path="/cart" element={<CartPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
      </Routes>

      <Footer />
    </div>
  );
}
