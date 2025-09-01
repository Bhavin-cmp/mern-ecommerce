import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  /* const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); */

  const [form, setForm] = useState({
    userName: "",
    fullName: "",
    email: "",
    password: "",
    dob: "",
    profileImage: null,
  });

  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMesssage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      //   navigate("/");
    }
  }, [userInfo, navigate]);

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 character long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    console.log("imageeeeeeeeeeee", files);
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setMessage(passwordError);
      return;
    }
    if (form.password !== confirm) {
      setMessage("Passwords don't match");
      return;
    } else {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      dispatch(registerUser(formData)).catch((error) => {
        setMessage(error || "Error occured while registration");
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-sky-500">
        Register
      </h2>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
          {successMessage}
        </div>
      )}

      {message && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}

      <form
        onSubmit={submitHandler}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <div>
          <label className="block text-sm mb-1 text-black">Username</label>
          <input
            type="text"
            name="userName"
            className="w-full border px-3 py-2 rounded border-gray-500 text-black"
            value={form.userName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-black">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="w-full border px-3 py-2 rounded border-gray-500 text-black"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-black">Date of Birth</label>
          <input
            type="date"
            name="dob"
            className="w-full border px-3 py-2 rounded border-gray-500 text-black"
            value={form.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-black">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border px-3 py-2 rounded border-gray-500 text-black"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-black">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border px-3 py-2 rounded border-gray-500 text-black"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-black">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full border px-3 py-2 rounded border-gray-500 text-black"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-black">Profile Image</label>
          <input
            type="file"
            name="profileImage"
            className="w-full border px-3 py-2 rounded border-gray-500 text-black"
            onChange={handleChange}
            accept="image/*"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-blue-600 text-white py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="text-sm text-center mt-4 text-black">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default RegisterPage;
