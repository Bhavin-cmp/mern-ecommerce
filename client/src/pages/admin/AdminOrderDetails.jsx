import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderById,
  updateOrderStatus,
} from "../../redux/slices/orderSlice";
import { useParams } from "react-router-dom";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state) => state.order);
  const [status, setStatus] = useState("");

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (order) setStatus(order.status);
  }, [order]);

  const handleStatusUpdate = () => {
    if (status && status !== order.status) {
      dispatch(updateOrderStatus({ id: order._id, status }));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto mt-12 bg-white p-8 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <div className="mb-4">
        <strong>Order ID:</strong> {order._id}
      </div>
      <div className="mb-4">
        <strong>User:</strong> {order.user?.name} ({order.user?.email})
      </div>
      <div className="mb-4">
        <strong>Shipping Address:</strong> {order.shippingAddress}
      </div>
      <div className="mb-4">
        <strong>Payment Status:</strong> {order.isPaid ? "Paid" : "Not Paid"}
      </div>
      <div className="mb-4">
        <strong>Status:</strong>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="ml-2 border px-2 py-1 rounded"
        >
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button
          onClick={handleStatusUpdate}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
          disabled={status === order.status}
        >
          Update Status
        </button>
      </div>
      <div>
        <strong>Products:</strong>
        <ul className="list-disc pl-6 mt-2">
          {order.orderItems.map((item) => (
            <li key={item._id}>
              {item.name} x {item.qty} (${item.price} each)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
