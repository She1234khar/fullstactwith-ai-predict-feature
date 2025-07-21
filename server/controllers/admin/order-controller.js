const order = require('../../models/Order');

const getAllOrdersOfAllUsers=async (req, res) => {
  try{
    
    const orders = await order.find({})
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

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await order.findById(id);
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Order details fetched successfully',
      data: orders,
    });

  }catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while fetching order details!',
    });
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    const orders = await order.findById(id);
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    await order.findByIdAndUpdate(id, { orderStatus });
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: orders,
    });
    

  }catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while updating order status!',
    });
  }
}



module.exports ={getAllOrdersOfAllUsers,getOrderDetailsForAdmin, updateOrderStatus};