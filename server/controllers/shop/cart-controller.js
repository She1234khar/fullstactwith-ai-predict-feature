const Cart =require("../../models/Cart")
const Product = require("../../models/Product");
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.totalStock || product.totalStock < quantity) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].totalPrice =
        cart.items[existingItemIndex].quantity * (product.salePrice && product.salePrice > 0 ? product.salePrice : product.price);
    } else {
      cart.items.push({
        productId,
        quantity,
        totalPrice: quantity * (product.salePrice && product.salePrice > 0 ? product.salePrice : product.price),
      });
    }

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "title image price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || error,
    });
  }
};

const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const validItems = cart.items.filter((productItem) => productItem.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }
    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (findCurrentProductIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    cart.items[findCurrentProductIndex].totalPrice =
      quantity * (cart.items[findCurrentProductIndex].productId.salePrice && cart.items[findCurrentProductIndex].productId.salePrice > 0 ? cart.items[findCurrentProductIndex].productId.salePrice : cart.items[findCurrentProductIndex].productId.price);

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "title image price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.productId ? item.quantity : null,
    }));

    res.status(200).json({
      success: true,
      data: {
        cart: cart._doc,
        items: populateCartItems,
      },
      message: "Cart item quantity updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const deleteCartItems = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "title image price salePrice",
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );
    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "title image price salePrice",
    });
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : null,
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.productId ? item.quantity : null,
    }));

    res.status(200).json({
      success: true,
      data: {
        cart: cart._doc,
        items: populateCartItems,
      },
      message: "Cart item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
module.exports = { addToCart, updateCartItemQty, deleteCartItems, fetchCartItems };

