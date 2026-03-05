import { useMemo, useState } from "react";

import ArchiveIntro from "../components/ArchiveIntro";
import Gallery from "../components/Gallery";
import ProductModal from "../components/ProductModal";

export default function ShopPage({ photos, productTypes }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const productList = productTypes || {};

  const shopPhotos = useMemo(
    () => (photos || []).filter((p) => p.mode === "SHOP"),
    [photos]
  );

  const handleCellClick = (photo) => {
    if (!photo) return;
    if (photo.mode !== "SHOP") return;
    if (!productTypes) return;
    setSelectedPhoto(photo);
  };

  const closeModal = () => setSelectedPhoto(null);

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <ArchiveIntro title="INDEX_BY_ZAKA">
        <p className="text-xl md:text-2xl font-bold uppercase opacity-80 tracking-wide">
          Selected works available as objects.
        </p>

        <p className="mt-4 text-base md:text-lg">
          Choose a photo. Pick a product type.
        </p>
      </ArchiveIntro>

      <Gallery
        photos={shopPhotos}
        onSelectPhoto={handleCellClick}
        projectPhoto={null}
        onCloseProject={undefined}
      />

      {selectedPhoto && productTypes && (
        <ProductModal
          photo={selectedPhoto}
          products={productList}
          onClose={closeModal}
        />
      )}
    </main>
  );
}