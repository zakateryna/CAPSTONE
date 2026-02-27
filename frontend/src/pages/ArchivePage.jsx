import { useMemo, useState } from "react";

import ArchiveIntro from "../components/ArchiveIntro";
import MarqueeBar from "../components/MarqueeBar";

import Gallery from "../components/Gallery";
import ProductModal from "../components/ProductModal";
import ArtworkModal from "../components/ArtworkModal";

export default function ArchivePage({ photos, productTypes }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null); 
  const [projectPhoto, setProjectPhoto] = useState(null);  

  const productList = productTypes || {};

  const orderedPhotos = useMemo(() => {
    return [...(photos || [])].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }, [photos]);

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
        photos={orderedPhotos}
        onSelectPhoto={handleCellClick}
        projectPhoto={projectPhoto}
        onCloseProject={closeProject}
      />

      {selectedPhoto?.mode === "SHOP" && productTypes && (
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