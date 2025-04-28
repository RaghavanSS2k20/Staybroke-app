import mongoose from "mongoose";
const  MONGODB_URI  = process.env.MONGODB_URI;
export const connectDB = async () => {
  try {
    if(MONGODB_URI){
    const { connection } = await mongoose.connect(MONGODB_URI);

    if (connection.readyState === 1) {
        console.log("Mongo DB COnnected successfully ✅")
      return Promise.resolve(true);
    }
}else{
    throw "MOngoDB URI"
}
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};