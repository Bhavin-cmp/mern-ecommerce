import Order from "../models/Order.model.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

export const createOrder = asyncHandler(async (req, res) => {
  // console.log("Order bodt data", req.body);
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
    const requiredFields = [
      "orderItems",
      "shippingAddress",
      "paymentMethod",
      "itemPrice",
      "taxPrice",
      "shippingPrice",
      "totalPrice",
    ];

    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res
          .status(400)
          .json({ success: false, message: `${field} is required` });
      }
    }
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createOrder = await order.save();
    if (createOrder) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.user.email,
        subject: "Order Confirmation",
        text: `Dear ${req.user.fullName},\n\nYour order with ID ${
          createOrder._id
        } has been successfully placed.\n\nOrder Details:\nItems: ${createOrder.orderItems
          .map((item) => `${item.name} (Qty: ${item.qty})`)
          .join(", ")}\nTotal Price: $${
          createOrder.totalPrice
        }\n\nThank you for shopping with us!\n\nBest Regards,\nYour E-Commerce Team`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending confirmation email:", error);
        } else {
          console.log("Confirmation email sent:", info.response);
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Order not created",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order Created Successfully",
      order: createOrder,
    });
  } catch (error) {
    console.log(`Error While creating Order ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error Occured while creating the order",
      error: error.message,
    });
  }
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.status = status;
  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  await order.save();
  res.json(order);
});

/* ===============================================Get All Order==================================================== */
export const getMyOrders = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch orders for the authenticated user
    const userOrders = await Order.find({ user: userId });

    // Check if the user has any orders
    if (userOrders.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    // Return the orders
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: userOrders,
    });
  } catch (error) {
    console.error(`Error while fetching orders: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error while fetching order details",
      error: error.message,
    });
  }
});
/* ======================================Get Order==================================================================== */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate(
      "user",
      "id name userName email fullName"
    );

    if (!orders) {
      return res.status(400).json({
        success: false,
        message: "No Orders found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: orders,
    });
  } catch (error) {
    console.log(`Error while fetching all orders ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error while fetching all orders",
      error: error.message,
    });
  }
};
/* ============================================Get Order By Id======================================================= */
export const getOrderById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(200).json({
        success: false,
        message: "Order Id is required",
      });
    }
    const order = await Order.findById(id).populate("user", "name email");
    if (!order) {
      return res.status(200).json({
        success: false,
        message: "No Orders found with this ID",
      });
    }

    if (
      req.user._id.toString() !== order.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.log(`Error While fetching Order By ID ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error fetching the order using ID`,
      error: error.message,
    });
  }
});
/* ============================================================================================================ */
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is Required",
      });
    }

    const order = await Order.findById(id);
    // console.log("updateOrderpaid id", order);
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "No Order Found with this ID",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = req.body.paymentMethod || order.paymentMethod;
    order.paymentStatus = req.body.paymentStatus || "Paid";

    // Prefer Razorpay fields if present, else use paymentResult
    if (req.body.razorpay_payment_id) {
      order.paymentResult = {
        razorpay_payment_id: req.body.razorpay_payment_id,
        razorpay_order_id: req.body.razorpay_order_id,
        razorpay_signature: req.body.razorpay_signature,
      };
    } else if (req.body.paymentResult) {
      order.paymentResult = req.body.paymentResult;
    }

    const updatedOrder = await order.save();
    if (!updatedOrder) {
      return res.status(400).json({
        success: false,
        message: "Error while updating the order",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order Updated to paid Successfully",
      updatedOrder,
    });
  } catch (error) {
    console.log(`Error while updating order to paid ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error while updating the order to paid",
      error: error.message,
    });
  }
});
/* =============================================================================================== */
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the Order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID",
      });
    }

    // Find the order by ID
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No Order Found with this ID",
      });
    }

    // Update the order to delivered
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    if (!updatedOrder) {
      return res.status(500).json({
        success: false,
        message: "Error while updating the order",
      });
    }

    // Return the updated order
    return res.status(200).json({
      success: true,
      message: "Order Updated to delivered Successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error(`Error while updating order to delivered: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error while updating the order to delivered",
      error: error.message,
    });
  }
});
