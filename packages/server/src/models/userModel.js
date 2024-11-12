import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plaidAccessToken: { type: String },
  bitcoinAddress: { type: String, unique: true, sparse: true },
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
