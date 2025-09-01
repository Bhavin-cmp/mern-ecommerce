import { User } from "../models/user.model.js";

export const addAddress = async (req, res) => {
  try {
    const id = req.user._id;
    if (!id) {
      return res.status(400).json({
        suceess: false,
        message: "User Id not Found to Add Address",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not found to Add Address",
      });
    }

    user.addresses.push(req.body); // req.body = { address, city, postalCode, country, label }
    await user.save();

    res.status(201).json({
      success: true,
      addresses: user.addresses,
      message: "User Address added sucessfully",
    });
  } catch (error) {
    console.log("Error While adding address", error.message);
    return res.status(500).json({
      suceess: false,
      message: "Address not add",
      error: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const id = req.user._id;
    if (!id) {
      return res.status(400).json({
        suceess: false,
        message: "User Id not Found to update Address",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        suceess: false,
        message: "User not Found to update Address",
      });
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    Object.assign(address, req.body);
    await user.save();

    res.status(200).json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    console.log("Error While updating address", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while Updating address",
      error: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // user.addresses.id(req.params.addressId).remove();
    user.addresses = user.addresses.filter(
      (addr) => addr.id.toString() !== req.params.addressId
    );
    await user.save();

    res.status(200).json({
      success: true,
      addresses: user.addresses,
      message: "User Address Deleted Sucessfully",
    });
  } catch (error) {
    console.log("Error While deleting address", error.message);
    return res.status(500).json({
      success: false,
      message: "Error Deleting Address",
      error: error.message,
    });
  }
};
