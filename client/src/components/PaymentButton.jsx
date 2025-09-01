import React from "react";
import axios from "axios";
import { CreditCard } from "lucide-react";
import { useState } from "react";

const PaymentButton = ({ amount, orderId, onSuccess }) => {
  //   console.log("What i am receiving : ", amount, orderId, onSuccess);

  const token = localStorage.getItem("token");
  const handlePayment = async () => {
    try {
      const { data: razorPayOrder } = await axios.post(
        "http://localhost:8000/api/razorpay/create-order",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: "rzp_test_R8dWOPDr511gGs",
        amount: razorPayOrder.amount,
        currency: razorPayOrder.currency || "INR",
        name: "ClicktoShop",
        description: "Demo Payment",
        order_id: razorPayOrder.id,
        handler: async function (response) {
          const paymentId = response.razorpay_payment_id;
          const orderIdFromRazorpay =
            response.razorpay_order_id || razorPayOrder.id;
          const signature = response.razorpay_signature;

          /* alert(
            `✅ Payment Successful!\n\nPayment Id: ${paymentId}\nOrder Id: ${orderIdFromRazorpay}`
          ); */

          if (orderId) {
            await axios.put(
              `http://localhost:8000/api/orders/${orderId}/pay`,
              {
                razorpay_payment_id: paymentId,
                razorpay_order_id: orderIdFromRazorpay,
                razorpay_signature: signature,
                paymentMethod: "Razorpay",
                paymentStatus: "Paid",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
          if (onSuccess) onSuccess(response);
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
        },
        theme: {
          color: "#3399cc",
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      alert("❌ Failed to initiate payment. Please try again.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-400 
      text-white px-6 py-3 rounded-2xl font-semibold shadow-md hover:shadow-xl 
      hover:scale-105 transition-all duration-300 ease-in-out active:scale-95"
    >
      <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      Pay ₹{amount} with Razorpay
    </button>
  );
};

export default PaymentButton;
