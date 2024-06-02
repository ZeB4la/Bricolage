const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantityAvailable: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
