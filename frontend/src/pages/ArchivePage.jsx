import { useMemo, useState } from "react";

import ArchiveIntro from "../components/ArchiveIntro";
import MarqueeBar from "../components/MarqueeBar";

import Gallery from "../components/Gallery";
import ProductModal from "../components/ProductModal";
import ArtworkModal from "../components/ArtworkModal";

import { PRODUCT_TYPES } from "../data/productTypes";



export default function ArchivePage({ photos }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null); // SHOP / FEATURE
  const [projectPhoto, setProjectPhoto] = useState(null);   // LINK

const productList = PRODUCT_TYPES;

  const handleCellClick = (photo) => {
    if (!photo) return;

    if (photo.mode === "COMING_SOON") return;

    if (photo.mode === "LINK") {
      setProjectPhoto((prev) => (prev?.id === photo.id ? null : photo));
      setSelectedPhoto(null);
      return;
    }

    if (photo.mode === "FEATURE") {
      setProjectPhoto(null);
      setSelectedPhoto(photo);
      return;
    }

    if (photo.mode === "SHOP") {
      setProjectPhoto(null);
      setSelectedPhoto(photo);
      return;
    }
  };

  const closeModal = () => setSelectedPhoto(null);
  const closeProject = () => setProjectPhoto(null);

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <ArchiveIntro title="INDEX_BY_ZAKA" channel="Channel_01 — Archive">
        <p className="font-bold uppercase opacity-80">
          Between capture and creation.
        </p>
        <p>A temporary archive dedicated to movement.</p>
        <p>Real places filtered through perception.</p>
        <p>Some untouched.</p>
        <p>Some reworked.</p>
        <p>Every image exists between geography and imagination.</p>
      </ArchiveIntro>

      <MarqueeBar text="Transmission_Active ✦ Some_travels_become_collectible_fragments ✦ Click_and_explore" />

      <Gallery
        photos={photos}
        onSelectPhoto={handleCellClick}
        projectPhoto={projectPhoto}
        onCloseProject={closeProject}
      />

      {selectedPhoto?.mode === "SHOP" && (
        <ProductModal
          photo={selectedPhoto}
          products={productList}
          onClose={closeModal}
        />
      )}

      {selectedPhoto?.mode === "FEATURE" && (
        <ArtworkModal photo={selectedPhoto} onClose={closeModal} />
      )}
    </main>
  );
}
