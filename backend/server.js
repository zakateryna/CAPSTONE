import express from "express";
import cors from "cors";
import "dotenv/config";
import Stripe from "stripe";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ ping
app.get("/health", (_req, res) => res.json({ ok: true }));

// ✅ Stripe: crea PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency, items, idempotencyKey } = req.body;

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 50) {
      return res.status(400).json({
        ok: false,
        code: "INVALID_AMOUNT",
        message: "Importo non valido. Riprova tra un attimo.",
      });
    }

    const cur = (currency || "eur").toLowerCase();

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amt,
        currency: cur,
        automatic_payment_methods: { enabled: true },
        metadata: {
          source: "index_by_zaka",
          items: items ? JSON.stringify(items).slice(0, 500) : "",
        },
      },
      idempotencyKey ? { idempotencyKey } : undefined
    );

    return res.json({
      ok: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("create-payment-intent error:", err);

    // messaggio rassicurante, tecnico solo in console
    return res.status(500).json({
      ok: false,
      code: "INTENT_FAILED",
      message: "Connessione instabile o servizio non disponibile. Riprova.",
    });
  }
});


const PORT = process.env.PORT || 4545;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
