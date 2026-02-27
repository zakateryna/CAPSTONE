import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    baseName: { type: String, required: true },         
    title: { type: String, default: "" },               
    productKey: { type: String, required: true },      
    productLabel: { type: String, default: "" },        

    qty: { type: Number, required: true, min: 1, max: 20 },

    unitPriceCents: { type: Number, required: true, min: 0 },
    lineTotalCents: { type: Number, required: true, min: 0 },

    mockupUrl: { type: String, default: null },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    items: { type: [OrderItemSchema], default: [] },

    subtotalCents: { type: Number, required: true, default: 0 },
    totalCents: { type: Number, required: true, default: 0 },

    currency: { type: String, default: "eur" },

    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "PAID", "FAILED", "CANCELED", "REFUNDED"],
    },

    email: { type: String, default: null },
    note: { type: String, default: null },

    stripePaymentIntentId: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);