const paypal = require('../../helpers/paypal');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const Product = require('../../models/Product');

//const product=require('../../models/Product')

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Validate cartItems
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty or invalid',
      });
    }
    // Validate price and quantity
    for (const item of cartItems) {
      if (
        typeof item.price !== 'number' ||
        isNaN(item.price) ||
        item.price <= 0 ||
        typeof item.quantity !== 'number' ||
        isNaN(item.quantity) ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid price or quantity in cart items',
        });
      }
    }
    // Validate totalAmount
    if (typeof totalAmount !== 'number' || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid total amount',
      });
    }

    // Check stock for each cart item before creating order
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product || !product.totalStock || product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Product '${item.title}' is out of stock`,
        });
      }
    }

    // Check CLIENT_BASE_URL
    if (!process.env.CLIENT_BASE_URL) {
      return res.status(500).json({
        success: false,
        message: 'CLIENT_BASE_URL is not set in environment variables',
      });
    }

    // Calculate PayPal items and total
    const paypalItems = cartItems.map(item => ({
      name: item.title,
      price: (item.salePrice && item.salePrice > 0 ? item.salePrice : item.price).toFixed(2),
      currency: 'USD',
      quantity: item.quantity,
    }));
    const paypalTotal = paypalItems.reduce((sum, item, idx) => {
      return sum + (parseFloat(item.price) * cartItems[idx].quantity);
    }, 0);

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: paypalItems,
          },
          amount: {
            currency: 'USD',
            total: paypalTotal.toFixed(2),
          },
          description: 'Order payment',
        },
      ],
    };

    // Wrap PayPal payment creation in a promise for async/await
    const createPaypalPayment = (create_payment_json) => {
      return new Promise((resolve, reject) => {
        paypal.payment.create(create_payment_json, (error, paymentInfo) => {
          if (error) return reject(error);
          resolve(paymentInfo);
        });
      });
    };

    let paymentInfo;
    try {
      paymentInfo = await createPaypalPayment(create_payment_json);
    } catch (error) {
      console.error('Error creating PayPal payment:', error.response || error);
      return res.status(500).json({
        success: false,
        message: 'Error creating PayPal payment',
        details: error.response || error.message || error,
      });
    }

    // Save order details to the database
    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate: new Date(orderDate),
      orderUpdateDate: new Date(orderUpdateDate),
      paymentId,
      payerId,
    });

    await newOrder.save();

    // Decrease product stock for each cart item
    for (const item of cartItems) {
      if (item.productId && item.quantity) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { totalStock: -item.quantity } }
        );
      }
    }

    const approvalURL = paymentInfo.links.find(link => link.rel === 'approval_url')?.href;

    return res.status(200).json({
      success: true,
      message: 'Order created successfully',
      approvalURL,
      orderId: newOrder._id,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Some error occurred!',
      details: e.message || e,
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.paymentStatus = 'paid';
    order.paymentId = paymentId;
    order.payerId = payerId;
    order.orderStatus = 'completed';

    const cartId = order.cartId;

    // for(let item of order.cartItems){
    //   let product = await Product.findById(item.productId);
    //   if(!product){
    //     return res.status(404).json({
    //       success: false,
    //       message: `Not enough stock for this product`,
    //       });
    //   }
    //   product.quantity -= item.quantity;
    //   await product.save();
    // }


    
    await Cart.findByIdAndDelete(cartId);

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Payment captured successfully and cart cleared!',
      data: order,
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: 'Some error occurred!',
    });
  }
};

const getAllOrdersByUser=async (req, res) => {
  try{
    const {userId} =req.params;
    const orders = await Order.find({ userId })
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found for this user',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while fetching orders!',
    });
  }
}

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Order details fetched successfully',
      data: order,
    });

  }catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while fetching order details!',
    });
  }
}

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    let order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update order status to cancelled
    order.orderStatus = 'cancelled';
    order.paymentStatus = 'cancelled';
    order.orderUpdateDate = new Date();

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: 'Some error occurred while cancelling order!',
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  cancelOrder,
};
