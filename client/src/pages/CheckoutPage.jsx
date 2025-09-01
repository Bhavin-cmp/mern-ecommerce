import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createOrder, resetOrder } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { addAddress, fetchAddresses } from "../redux/slices/addressSlice";
import PaymentButton from "../components/PaymentButton";

const CheckoutPage = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { loading, success, error, order } = useSelector(
    (state) => state.order
  );
  const { addresses } = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [errors, setErrors] = useState({});
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Fetch Address on mount
  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  // When user selects an address, fill the form
  useEffect(() => {
    if (selectedAddressId && addresses.length > 0) {
      const addr = addresses.find((a) => a._id === selectedAddressId);
      if (addr) {
        setShipping({
          address: addr.address,
          city: addr.city,
          postalCode: addr.postalCode,
          country: addr.country,
        });
      }
    }
  }, [selectedAddressId, addresses]);

  // Simple validation
  const validate = () => {
    const newErrors = {};
    if (!shipping.address) newErrors.address = "Address is required";
    if (!shipping.city) newErrors.city = "City is required";
    if (!shipping.postalCode) newErrors.postalCode = "Postal code is required";
    if (!shipping.country) newErrors.country = "Country is required";
    if (!paymentMethod) newErrors.paymentMethod = "Payment method is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (
      saveAddress &&
      !addresses.some(
        (a) =>
          a.address === shipping.address &&
          a.city === shipping.city &&
          a.postalCode === shipping.postalCode &&
          a.country === shipping.country
      )
    ) {
      await dispatch(addAddress({ ...shipping }));
      toast.success("Address saved to your account!");
    }

    const action = await dispatch(
      createOrder({
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.image || "/placeholder.png",
          price: item.product.price,
          qty: item.quantity,
        })),
        shippingAddress: shipping,
        paymentMethod,
        itemPrice: total,
        taxPrice: 1,
        shippingPrice: 2,
        totalPrice: total,
      })
    );

    console.log("Order creation action:", action);
    console.log("Selected paymentMethod:", paymentMethod);

    if (action.payload && paymentMethod === "card") {
      const orderId = action.payload.order._id;
      const amount = action.payload.order.totalPrice;
      setCreatedOrder({ orderId, amount });
      setShowRazorpay(true);
    } else if (action.payload && paymentMethod === "cod") {
      // COD flow: redirect or show success
      toast.success("Order Placed Successfully");
      dispatch(clearCart());
      dispatch(resetOrder());
      navigate(`/order/${action.payload.order._id}`);
    }
  };

  // After successful payment, redirect and clear cart
  const handlePaymentSuccess = () => {
    toast.success("Payment Successful! Order Placed.");
    dispatch(clearCart());
    dispatch(resetOrder());
    if (createdOrder) {
      navigate(`/order/${createdOrder.orderId}`);
    }
  };

  // redirect or reset after successfully order (for COD)
  useEffect(() => {
    if (success && order && paymentMethod === "cod") {
      toast.success("Order Placed Successfully");
      dispatch(clearCart());
      dispatch(resetOrder());
      navigate(`/order/${order.order._id}`);
    }
    // eslint-disable-next-line
  }, [success, order, dispatch, navigate]);

  return (
    <div className="grid md:grid-cols-2 gap-8 bg-white shadow-md rounded-xl p-6 pt-28">
      {loading && <div className="text-blue-600 mb-2">Placing Order.....</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handlePlaceOrder} className="space-y-4">
        <h2 className="text-2xl text-sky-900 font-bold mb-4">
          Shipping Information
        </h2>

        {/* Address Drop Down */}
        {addresses && addresses.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Saved Address
            </label>
            <div className="relative rounded-md shadow-sm">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-800 py-3 px-4 pr-10 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
              >
                <option value="">-- Add New Address --</option>
                {addresses.map((addr) => (
                  <option value={addr._id} key={addr._id}>
                    {addr.address}, {addr.city}, {addr.country} (
                    {addr.label || "Address"})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Address Form */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shipping.address}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-black"
          required
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address}</p>
        )}
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shipping.city}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-black"
          required
        />
        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shipping.postalCode}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-black"
          required
        />
        {errors.postalCode && (
          <p className="text-red-500 text-sm">{errors.postalCode}</p>
        )}
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shipping.country}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-black"
          required
        />
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country}</p>
        )}

        {/* Save Address Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="saveAddress"
            id="saveAddress"
            checked={saveAddress}
            onChange={() => setSaveAddress((prev) => !prev)}
          />
          <label htmlFor="saveAddress" className="text-black">
            Save This Address to my account
          </label>
        </div>

        <h2 className="text-2xl text-sky-900 font-bold mb-4">Payment Method</h2>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-black">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={handlePaymentChange}
            />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2 text-black">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={handlePaymentChange}
            />
            Credit/Debit Card
          </label>
        </div>
        {errors.paymentMethod && (
          <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
        )}

        {/* Show card fields if card is selected */}
        {/* {paymentMethod === "card" && (
          <div className="space-y-2">
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              className="w-full border rounded px-3 py-2 text-black"
              required
            />
            <input
              type="text"
              name="expiry"
              placeholder="Expiry (MM/YY)"
              className="w-full border rounded px-3 py-2 text-black"
              required
            />
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              className="w-full border rounded px-3 py-2 text-black"
              required
            />
          </div>
        )} */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      {/* Razorpay Payment Button (only after order is created and payment method is card) */}
      {showRazorpay && createdOrder && (
        <div className="mt-6">
          <PaymentButton
            amount={createdOrder.amount}
            orderId={createdOrder.orderId}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4 text-black">Order Summary</h2>
        <ul className="divide-y">
          {cartItems.map((item) => (
            <li
              key={item.product._id}
              className="py-2 flex justify-between text-black"
            >
              <Link
                to={`/product/${item.product._id}`}
                className="text-lg font-semibold text-gray-800 hover:text-blue-600"
              >
                {item.product.name} x{" "}
                <span className="text-black">{item.quantity}</span>
              </Link>
              <span className="text-black">
                ₹{(item.product.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="text-xl font-bold mt-4 text-black">
          Total: ₹{total.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
