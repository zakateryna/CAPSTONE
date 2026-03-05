import express from "express";
import cors from "cors";
import "dotenv/config";
import Stripe from "stripe";
import path from "path";
import fs from "fs";

import { connectDB } from "./src/db/connect.js";
import ordersRouter from "./src/routes/orders.routes.js";
import stripeWebhookRouter from "./src/routes/stripe.webhook.routes.js";
import starsRouter from "./src/routes/stars.routes.js";
import adminOrdersRouter from "./src/routes/admin.orders.routes.js";
import { PRODUCT_TYPES } from "./src/config/catalog.js";

const app = express();

/* CORS */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
  })
);

/* Stripe Webhook */
app.use("/api/stripe", stripeWebhookRouter);

/* JSON */
app.use(express.json());

/* Routes API */
app.use("/api/orders", ordersRouter);
app.use("/api/stars", starsRouter);
app.use("/api/admin/orders", adminOrdersRouter);

/* Product types */
app.get("/api/product-types", (_req, res) => {
  res.json({ ok: true, items: Object.values(PRODUCT_TYPES) });
});

/* Static assets */
app.use("/assets", express.static(path.join(process.cwd(), "public")));

/* Health */
app.get("/health", (_req, res) => res.json({ ok: true }));

/* Photos */
const PHOTOS_DIR = path.join(process.cwd(), "public", "images", "photos");
const META_PATH = path.join(process.cwd(), "public", "meta", "photos.json");
const BASE_URL = (process.env.BASE_URL || "").replace(/\/+$/, "");

function getBaseNameFromFile(file) {
  return path.parse(file).name;
}

function readPhotosMeta() {
  if (!fs.existsSync(META_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(META_PATH, "utf-8"));
  } catch (e) {
    console.error("photos.json invalid:", e);
    return {};
  }
}

function readPhotoFiles() {
  if (!fs.existsSync(PHOTOS_DIR)) return [];
  return fs.readdirSync(PHOTOS_DIR).filter((file) => /\.(png|jpg|jpeg|webp)$/i.test(file));
}

function buildPhotoList() {
  const meta = readPhotosMeta();
  const files = readPhotoFiles();

  const photos = files.map((file) => {
    const m = meta[file] || {};
    const baseName = m.baseName ?? getBaseNameFromFile(file);

    return {
      id: m.id ?? baseName,
      baseName,
      title: m.title ?? baseName,
      file,
      src: `${BASE_URL}/assets/images/photos/${file}`, // ✅ FIX
      mode: m.mode ?? "COMING_SOON",
      color: m.color ?? "bg-[#93D5B3]",
      note: m.note ?? undefined,
      href: m.href ?? undefined,
    };
  });

  photos.sort((a, b) => {
    const an = Number(a.id);
    const bn = Number(b.id);
    const bothNums = Number.isFinite(an) && Number.isFinite(bn);
    if (bothNums) return an - bn;
    return String(a.title).localeCompare(String(b.title));
  });

  return photos;
}

app.get("/api/photos", (_req, res) => {
  const photos = buildPhotoList();
  return res.json({ ok: true, items: photos });
});

/* START SERVER */
const PORT = process.env.PORT || 4545;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup error:", err);
    process.exit(1);
  }
}

start();