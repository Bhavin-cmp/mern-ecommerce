import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserInfo, isUserLoggedIn } from "../utils/auth";
import { editUserProfile, fetchUserById } from "../redux/slices/userSlice";

const EditProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = getUserInfo();

  const { user, loading, error } = useSelector((state) => state.users);
  // console.log("usernameeee", user);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    profileImage: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const sanitize = (str) =>
    str
      ?.toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/gi, "");

  const userName = sanitize(user?.fullName);
  const userId = user?._id;
  const timestamp = Date.now();
  const publicId = `user_profiles/${userName}_${userId}/profile_${userName}_${timestamp}`;
  // console.log("Uploading to Cloudinary with public_id:", publicId);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "e_commerce");
    formData.append("public_id", publicId);
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/bhavindev/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    // console.log("Cloudinary response public_id:", data.public_id);

    return data.secure_url;
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    dispatch(fetchUserById(userInfo.user.id));
  }, [dispatch, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        dob: user.dob ? user.dob.slice(0, 10) : "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.profileImage;
    if (selectedFile) {
      imageUrl = await uploadToCloudinary(selectedFile);
    }
    await dispatch(
      editUserProfile({ ...formData, profileImage: imageUrl, id: user._id })
    );
    setSuccessMessage("Profile Updated Successfully!");

    setTimeout(() => {
      navigate("/profile");
    }, 3000);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-sky-700 mb-8">
        Edit Profile
      </h2>
      {successMessage && (
        <p className="text-center text-green-600 font-semibold">
          {successMessage}
        </p>
      )}

      {loading ? (
        <p className="text-center text-blue-600 animate-pulse">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border-2 border-gray-600 text-black  px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full text-black border-2 border-gray-600 px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border-2 border-gray-600 px-3 py-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Profile Image URL
            </label>
            <input
              type="text"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              className="w-full border-2 border-gray-600 px-3 py-2 rounded text-black"
            />
          </div>
          <div className="text-center">
            <img
              src={
                previewImage ||
                (formData.profileImage
                  ? formData.profileImage
                  : "https://via.placeholder.com/150?text=Image+Not+Available")
              }
              alt="Profile Preview"
              className="w-32 h-32 rounded-full mx-auto text-black border-4 border-sky-500 shadow-md object-cover"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                  setPreviewImage(URL.createObjectURL(file));
                }
              }}
              className="mt-4 text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default EditProfilePage;
