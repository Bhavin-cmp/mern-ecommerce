import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const wishListCount = useSelector((state) => state.wishList.items.length);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // console.log("user informationssss", userInfo.user.userName);

  const logoutHandler = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      navigate("/login");
    }
  };

  //Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-primary">
          ShopEase
        </NavLink>
        <nav className="flex items-center gap-6">
          <NavLink
            to="/product"
            className={({ isActive }) =>
              isActive
                ? "!text-pink-600 !font-medium"
                : "hover:text-primary font-medium"
            }
          >
            Products
          </NavLink>

          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `relative font-medium ${
                isActive ? "!text-pink-600" : "!hover:text-primary"
              }`
            }
          >
            WishList
            {wishListCount > 0 && (
              <span className="ml-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {wishListCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? "!text-pink-600 !font-medium"
                : "hover:text-primary font-medium"
            }
          >
            Cart
            {totalQuantity > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {totalQuantity}
              </span>
            )}
          </NavLink>
          {userInfo ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex !bg-amber-100 items-center gap-2 focus:outline-none hover:bg-sky-100 transition-all p-1 rounded-full group"
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    userInfo.user.userName || "User"
                  )}&background=0D8ABC&color=fff&size=64`}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border border-sky-400 shadow-sm group-hover:shadow-md transition"
                />

                {/* Optional name next to avatar */}
                <span className="hidden md:block text-sm font-medium text-sky-800 group-hover:text-sky-900">
                  {userInfo.user.userName?.split(" ")[0] ||
                    userInfo.userName ||
                    "User"}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-amber-500 rounded shadow-lg z-50">
                  {userInfo?.user?.isAdmin && (
                    <Link
                      to="/admin/adminDashboard"
                      className="block px-4 py-2 hover:bg-gray-100 font-bold text-blue-700"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <NavLink
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 "
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/address"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Address
                  </NavLink>
                  <NavLink
                    to="/myOrders"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Orders
                  </NavLink>
                  <button
                    onClick={logoutHandler}
                    className="block w-full  px-4 py-2 !bg-white text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? "text-primary font-medium"
                  : "hover:text-primary font-medium"
              }
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
