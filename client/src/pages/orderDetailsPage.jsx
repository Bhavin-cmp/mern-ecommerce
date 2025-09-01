import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:8000/api/orders/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrder(data.order || data); // adjust based on your backend response
        setLoading(false);
      } catch (err) {
        setError("Could not fetch order details.");
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading)
    return <div className="text-sky-900">Loading order details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded p-8 mt-10">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Order Confirmed!
      </h2>
      <p className="mb-4 text-sky-900">
        Thank you for your purchase. Your order has been placed successfully.
      </p>
      <div className="mb-4 text-sky-900">
        <strong>Order ID:</strong> {order._id}
      </div>
      <div className="mb-4 text-sky-900">
        <strong>Shipping Address:</strong> {order.shippingAddress.address},{" "}
        {order.shippingAddress.city}, {order.shippingAddress.country} -{" "}
        {order.shippingAddress.postalCode}
      </div>
      <div className="mb-4 text-sky-900">
        <strong>Payment Method:</strong> {order.paymentMethod}
      </div>
      <div className="mb-4 text-sky-900">
        <strong>Order Items:</strong>
        <ul className="list-disc ml-6">
          {order.orderItems.map((item) => (
            <li key={item.product} className="list-none">
              {item.name} x {item.qty} - ${item.price}
            </li>
          ))}
        </ul>
      </div>
      <div className="font-bold text-xl text-sky-900">
        Total: ${order.totalPrice}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
