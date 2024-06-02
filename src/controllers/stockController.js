const Stock = require("../models/stockModel");
const Product = require("../models/productModel");

// Add Stock Entry
const addStockEntry = async (req, res) => {
  const { productId } = req.params;
  const { quantityAvailable } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const stock = new Stock({ product: productId, quantityAvailable });
    const newStock = await stock.save();

    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Stock Entries for Product
const getStockEntriesForProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const stockEntries = await Stock.find({ product: productId }).populate(
      "product"
    );
    res.json(stockEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addStockEntry,
  getStockEntriesForProduct,
};
