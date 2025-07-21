const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require('../../models/Product')
const { updatePriceHistory } = require('../shop/price-trend-controller')

async function handleImageUpload(req, res) {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);
    res.send({
      success: true,
      result
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: "Error uploading image"
    })
  }
}

// Add new product
const addproduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock
    } = req.body;
    const product = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice: salePrice || null,
      totalStock
    });
    await product.save();
    res.json({
      success: true,
      message: "Product added successfully",
      product
    });
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: "Error adding product"
    })
  }
}

//fetch all product
const featchProducts = async (req, res) => {
  try {
    const listofproduct = await Product.find({});
    res.json({
      success: true,
      message: "Products fetched successfully",
      listofproduct
    });
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: "Error fetching product"
    })
  }
}

// edit all product
const editProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock
    } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if price or sale price changed
    const priceChanged = product.price !== price;
    const salePriceChanged = product.salePrice !== (salePrice || null);
    
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.price = price || product.price;
    product.salePrice = salePrice || null;
    product.totalStock = typeof totalStock !== 'undefined' ? Number(totalStock) : product.totalStock;
    product.image = image || product.image;
    await product.save();
    
    // Update price history if price changed
    if (priceChanged || salePriceChanged) {
      await updatePriceHistory(product._id, product.price, product.salePrice);
    }
    res.json({
      success: true,
      message: "Product updated successfully",
      product
    });
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: "Error in editing product"
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      success: true,
      message: "Product deleted successfully",
      product
    });
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: "Error in deleting product"
    })
  }
}

module.exports = { handleImageUpload, addproduct, featchProducts, editProduct, deleteProduct };