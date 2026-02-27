import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import { PRODUCT_TYPES } from "../config/catalog.js";

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️ STRIPE_SECRET_KEY mancante nel .env");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");


function buildItemsAndTotals(rawItems = []) {
  const items = [];
  let subtotalCents = 0;

  for (const it of rawItems) {
    const productKey = it?.productKey;
    const baseName = it?.baseName;
    const qty = Number(it?.qty ?? 1);

    if (!PRODUCT_TYPES[productKey]) {
      const err = new Error(`INVALID_PRODUCT_KEY: ${productKey}`);
      err.status = 400;
      throw err;
    }

    if (!baseName || typeof baseName !== "string") {
      const err = new Error("INVALID_BASENAME");
      err.status = 400;
      throw err;
    }

    if (!Number.isFinite(qty) || qty < 1 || qty > 20) {
      const err = new Error("INVALID_QTY");
      err.status = 400;
      throw err;
    }

    const pt = PRODUCT_TYPES[productKey];
    const unitPriceCents = pt.priceCents;
    const lineTotalCents = unitPriceCents * qty;

    items.push({
      baseName,
      title: it?.title ?? baseName,
      productKey,
      productLabel: pt.label,
      qty,
      unitPriceCents,
      lineTotalCents,
      mockupUrl: it?.mockupUrl ?? null,
    });

    subtotalCents += lineTotalCents;
  }

  return { items, subtotalCents, totalCents: subtotalCents };
}

/* POST /api/orders */
router.post("/", async (req, res) => {
  try {
    const rawItems = req.body?.items;

    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ ok: false, code: "EMPTY_ITEMS" });
    }

    const { items, subtotalCents, totalCents } = buildItemsAndTotals(rawItems);

    const order = await Order.create({
      currency: "eur",
      status: "PENDING",
      items,
      subtotalCents,
      totalCents,
      email: req.body?.email ?? null,
      note: req.body?.note ?? null,
    });

    return res.json({ ok: true, order });
  } catch (err) {
    console.error("Create order error:", err);
    return res.status(err.status || 500).json({
      ok: false,
      code: "ORDER_CREATE_FAILED",
      message: err.message,
    });
  }
});

/* POST /api/orders/:id/payment-intent */
router.post("/:id/payment-intent", async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ ok: false, code: "STRIPE_NOT_CONFIGURED" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ ok: false, code: "NOT_FOUND" });

    if (order.status === "PAID") {
      return res.status(400).json({ ok: false, code: "ORDER_ALREADY_PAID" });
    }

    if (order.stripePaymentIntentId) {
      const pi = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
      return res.json({ ok: true, orderId: order._id, clientSecret: pi.client_secret });
    }

    const amount = Number(order.totalCents);
    if (!Number.isFinite(amount) || amount < 50) {
      return res.status(400).json({ ok: false, code: "INVALID_AMOUNT" });
    }

    const pi = await stripe.paymentIntents.create(
      {
        amount,
        currency: (order.currency || "eur").toLowerCase(),
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: String(order._id), 
          source: "index_by_zaka",
        },
      },
      { idempotencyKey: `order_${order._id}` }
    );

    order.stripePaymentIntentId = pi.id;
    await order.save();

    return res.json({ ok: true, orderId: order._id, clientSecret: pi.client_secret });
  } catch (err) {
    console.error("Create PI error:", err);
    return res.status(500).json({ ok: false, code: "PI_CREATE_FAILED" });
  }
});

/* GET /api/orders/:id */
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ ok: false, code: "NOT_FOUND" });
    return res.json({ ok: true, order });
  } catch {
    return res.status(400).json({ ok: false, code: "INVALID_ID" });
  }
});

/* PATCH /api/orders/:id/status  */
router.patch("/:id/status", async (req, res) => {
  try {
    const allowed = ["PENDING", "PAID", "FAILED", "CANCELED", "REFUNDED"];
    const status = req.body?.status;

    if (!allowed.includes(status)) {
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