import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is Required",
      });
    }
    const options = {
      amount: amount * 100, // amount in Rupees
      currency: "INR",
      receipt: "Order_receipt_1 " + Date.now(),
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      message: "Razorpay Order Created",
      order,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
    });
  }
};
