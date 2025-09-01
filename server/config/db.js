import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGODB_URI);

    console.log(
      `Mongodb Database Connected Sucessfully : ${response.connection.host}`
    );
  } catch (error) {
    console.log(`Error Connecting to the Database ${error.message}`);
  }
};

export default connectDb;
