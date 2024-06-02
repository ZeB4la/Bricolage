const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Stock = require("../models/stockModel");

// Create Product
const createProduct = async (req, res) => {
  const { title, category, description, price, minQuantity } = req.body;
  const image = req.file;

  try {
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const product = new Product({
      title,
      category,
      description,
      price,
      image: image.path,
      minQuantity,
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { title, category, description, price, minQuantity } = req.body;
  const image = req.file;

  try {
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" });
      }
    }

    const updates = {
      title,
      category,
      description,
      price,
      minQuantity,
    };

    if (image) {
      updates.image = image.path;
    }

    const product = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Stock.deleteMany({ product: productId });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
};
