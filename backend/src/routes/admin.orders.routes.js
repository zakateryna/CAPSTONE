import express from "express";
import Order from "../models/Order.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();
router.use(requireAdmin);

const ALLOWED = ["PENDING", "PAID", "FAILED", "CANCELED", "REFUNDED"];

/**
 * GET /api/admin/orders?status=PAID&q=email&page=1&limit=50
 */
router.get("/", async (req, res) => {
  try {
    const { status, q } = req.query;

    const page = Math.max(1, Number(req.query.page || 1));
    const limitRaw = Number(req.query.limit || 50);
    const limit = Math.min(200, Math.max(1, limitRaw));
    const skip = (page - 1) * limit;

    const filter = {};

    if (status) {
      if (!ALLOWED.includes(status)) {
        return res.status(400).json({ ok: false, code: "INVALID_STATUS_FILTER" });
      }
      filter.status = status;
    }

    if (q && String(q).trim()) {
      const s = String(q).trim();
      filter.$or = [{ email: { $regex: s, $options: "i" } }];
    }

    const [items, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ]);

    return res.json({
      ok: true,
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Admin list orders error:", err);
    return res.status(500).json({ ok: false, code: "ADMIN_LIST_FAILED" });
  }
});

/** GET /api/admin/orders/:id */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ ok: false, code: "NOT_FOUND" });
    return res.json({ ok: true, order });
  } catch {
    return res.status(400).json({ ok: false, code: "INVALID_ID" });
  }
});

/** PATCH /api/admin/orders/:id/status  body: { status } */
router.patch("/:id/status", async (req, res) => {
  try {
    const status = req.body?.status;
    if (!ALLOWED.includes(status)) {
      return res.status(400).json({ ok: false, code: "INVALID_STATUS" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();

    if (!order) return res.status(404).json({ ok: false, code: "NOT_FOUND" });
    return res.json({ ok: true, order });
  } catch {
    return res.status(400).json({ ok: false, code: "INVALID_ID" });
  }
});

export default router;