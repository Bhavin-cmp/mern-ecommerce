import React, { useEffect } from "react";
import {
  fetchCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cartItems } = useSelector((state) => {
    // console.log("cart Item state", state);
    return state.cart;
  });
  // console.log("cart Itemsssssssssss", cartItems);
  const dispatch = useDispatch();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const removeHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const updateQuantityHandler = (productId, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItemQuantity({ productId, quantity }));
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item?.product?.price * item?.quantity,
    0
  );

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <div className=" bg-white shadow-md rounded-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h2>

        {!isLoggedIn ? (
          <p className="text-lg">
            Please{" "}
            <Link to="/login" className="text-blue-600 underline font-medium">
              log in
            </Link>{" "}
            to view your cart.
          </p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-600 text-lg">No items in cart.</p>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item, index) =>
              item && item.product ? (
                <div
                  key={item.product._id}
                  className="cartDiv flex flex-col md:flex-row md:items-center justify-between border border-sky-600 rounded-2xl p-4 gap-4"
                >
                  <div className="flex items-start gap-4 text-black">
                    <img
                      src={item.product.image || "/placeholder.png"}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-xl border text-black"
                    />
                    <div>
                      <Link
                        to={`/product/${item.product._id}`}
                        className="text-lg font-semibold text-gray-800 hover:text-blue-600"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-gray-600 mt-1">
                        ${item.product.price} x {item.quantity}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantityHandler(
                              item.product._id,
                              item.quantity - 1
                            )
                          }
                          className="text-white px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="text-lg font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantityHandler(
                              item.product._id,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-1 rounded bg-gray-200 text-white hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeHandler(item.product._id)}
                    className="text-red-500 !bg-white !border-red-500 hover:underline font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ) : null
            )}

            <div className="text-right text-xl font-bold text-gray-800">
              Total: ${total.toFixed(2)}
            </div>

            <div className="flex justify-end">
              <Link
                to="/checkout"
                className="bg-sky-800 !text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
