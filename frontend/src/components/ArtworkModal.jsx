import { useEffect, useMemo, useState } from "react";
import ModalShell from "./ModalShell";

function getOrCreateUserId() {
  const key = "zaka_user_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id =
      crypto?.randomUUID?.() ||
      `u_${Math.random().toString(16).slice(2)}_${Date.now()}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export default function ArtworkModal({ photo, onClose }) {
  const STAR_KEY = "monthly_artwork";

  const userId = useMemo(() => getOrCreateUserId(), []);

  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // count globale
    fetch(`/api/stars/${encodeURIComponent(STAR_KEY)}`)
      .then((r) => r.json())
      .then((d) => setCount(Number(d?.count || 0)))
      .catch(() => setCount(0));

    // liked per user
    fetch(
      `/api/stars/${encodeURIComponent(
        STAR_KEY
      )}/me?userId=${encodeURIComponent(userId)}`
    )
      .then((r) => r.json())
      .then((d) => setLiked(!!d?.liked))
      .catch(() => setLiked(false));
  }, [STAR_KEY, userId]);

  const toggleStar = async () => {
    if (busy) return;
    setBusy(true);

    try {
      const res = await fetch(
        `/api/stars/${encodeURIComponent(STAR_KEY)}/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();
      setLiked(!!data?.liked);
      setCount(Number(data?.count || 0));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell title="Gallery_View.mode" onClose={onClose}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LEFT — Exhibit */}
        <div className="ui-card">
          <div className="ui-bar bg-[#93D5B3]">
            <div className="flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-base">image</span>
              <span className="ui-label">Exhibit</span>
            </div>
          </div>

          <div className="p-4">
            <div className="relative aspect-square border-4 border-[color:var(--color-primary)] bg-[#f8f8f8] overflow-hidden">
              <img
                src={photo?.src}
                alt={photo?.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <p className="mt-2 text-xs md:text-sm opacity-70">
              Showing: <span className="font-bold">{photo?.title}</span>
            </p>
          </div>
        </div>

        {/* RIGHT — Monthly Artwork */}
        <div className="ui-card">
          <div
            className={`ui-bar ${photo?.color || "bg-[color:var(--color-retro-yellow)]"
              }`}
          >
            <h2 className="ui-label">Monthly_Artwork</h2>
          </div>

          <div className="p-4 space-y-3 ui-body text-[color:var(--color-primary)]">
            <p className="font-bold uppercase opacity-80">
              Hello, Palermo was a good trip.
            </p>

            <p>
              This slot is reserved for people I’ve met — fragments of the
              journey, moments that stayed.
            </p>

            <p>No commerce. No trade. No ownership. Only observation.</p>

            <div className="mt-4 ui-panel flex items-center justify-between">
              <span className="ui-label">Leave_Your_Star</span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleStar}
                  aria-pressed={liked}
                  disabled={busy}
                  className="ui-btn px-2 py-1 flex items-center gap-1 disabled:opacity-60"
                  title={liked ? "Star recorded" : "Leave a star"}
                >
                  <span
                    className={[
                      "material-symbols-outlined text-[18px]",
                      liked
                        ? "text-[color:var(--color-retro-yellow)]"
                        : "text-[color:var(--color-primary)]",
                    ].join(" ")}
                  >
                    star
                  </span>

                  <span className="text-[11px] font-bold">{count}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}