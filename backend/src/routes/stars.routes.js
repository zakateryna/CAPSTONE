import express from "express";

const router = express.Router();

// In-memory store (si resetta quando riavvii il server)
const starCounts = Object.create(null); // { [photoId]: number }
const starByUser = Object.create(null); // { [photoId]: { [userId]: true } }

// GET count globale
router.get("/:photoId", (req, res) => {
  const { photoId } = req.params;
  return res.json({ ok: true, count: starCounts[photoId] || 0 });
});

// GET stato "liked" per user (così il frontend si allinea)
router.get("/:photoId/me", (req, res) => {
  const { photoId } = req.params;
  const userId = req.query.userId;

  if (!userId) return res.status(400).json({ ok: false, error: "userId required" });

  const liked = !!(starByUser[photoId] && starByUser[photoId][userId]);
  return res.json({ ok: true, liked });
});

// POST toggle (mette/toglie star) + ritorna count
router.post("/:photoId/toggle", (req, res) => {
  const { photoId } = req.params;
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ ok: false, error: "userId required" });

  if (!starByUser[photoId]) starByUser[photoId] = Object.create(null);
  if (!starCounts[photoId]) starCounts[photoId] = 0;

  const already = !!starByUser[photoId][userId];

  if (already) {
    delete starByUser[photoId][userId];
    starCounts[photoId] = Math.max(0, starCounts[photoId] - 1);
  } else {
    starByUser[photoId][userId] = true;
    starCounts[photoId] += 1;
  }

  return res.json({ ok: true, liked: !already, count: starCounts[photoId] });
});

export default router;