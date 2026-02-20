import { useMemo, useState } from "react";

import ArchiveIntro from "../components/ArchiveIntro";
import Gallery from "../components/Gallery";
import ProductModal from "../components/ProductModal";

import { PRODUCT_TYPES } from "../data/productTypes";

export default function ShopPage({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // prodotto list è costante: volendo puoi anche NON usare useMemo
  const productList = PRODUCT_TYPES;

  const shopPhotos = useMemo(
    () => photos.filter((p) => p.mode === "SHOP"),
    [photos]
  );

  const handleCellClick = (photo) => {
    if (!photo) return;
    if (photo.mode !== "SHOP") return;
    setSelectedPhoto(photo);
  };

  const closeModal = () => setSelectedPhoto(null);

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <ArchiveIntro title="INDEX_BY_ZAKA" channel="Channel_02 — Shop">
        <p className="font-bold uppercase opacity-80">
          Selected works available as objects.
        </p>
        <p>Choose a photo. Pick a product type.</p>
        <p>Poster / Tote / Mug / Notebook</p>
      </ArchiveIntro>

      <Gallery
        photos={shopPhotos}
        onSelectPhoto={handleCellClick}
        projectPhoto={null}
        onCloseProject={undefined}
      />

      {selectedPhoto && (
        <ProductModal
          photo={selectedPhoto}
          products={productList}
          onClose={closeModal}
        />
      )}
    </main>
  );
}
