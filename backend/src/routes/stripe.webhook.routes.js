import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

//api/stripe/webhook
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!whSecret) {
      console.warn("⚠️ STRIPE_WEBHOOK_SECRET mancante nel .env");
      return res.status(500).send("Webhook not configured");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, whSecret);
    } catch (err) {
      console.error("❌ Webhook signature verify failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      const obj = event.data?.object; // PaymentIntent
      const orderIdFromMeta = obj?.metadata?.orderId;
      const paymentIntentId = obj?.id;

      const findOrder = async () => {
        if (orderIdFromMeta) {
          const byId = await Order.findById(orderIdFromMeta);
          if (byId) return byId;
        }
        if (paymentIntentId) {
          return await Order.findOne({ stripePaymentIntentId: paymentIntentId });
        }
        return null;
      };

      const order = await findOrder();

      if (!order) {
        console.warn("⚠️ Webhook: ordine non trovato:", event.type, {
          orderIdFromMeta,
          paymentIntentId,
        });
        return res.json({ received: true });
      }

      if (event.type === "payment_intent.succeeded") {
        order.status = "PAID";
        order.stripePaymentIntentId = paymentIntentId || order.stripePaymentIntentId;
        await order.save();
      }

      if (event.type === "payment_intent.payment_failed") {
        order.status = "FAILED";
        order.stripePaymentIntentId = paymentIntentId || order.stripePaymentIntentId;
        await order.save();
      }

      if (event.type === "payment_intent.canceled") {
        order.status = "CANCELED";
        order.stripePaymentIntentId = paymentIntentId || order.stripePaymentIntentId;
        await order.save();
      }

      return res.json({ received: true });
    } catch (err) {
      console.error("❌ Webhook handler error:", err);
      return res.json({ received: true });
    }
  }
);

export default router;