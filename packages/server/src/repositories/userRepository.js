import UserModel from "~/models/userModel";

class UserRepository {
  static async create(user) {
    const newUser = new UserModel(user);
    return newUser.save();
  }

  static async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  static async findById(id) {
    return UserModel.findById(id);
  }

  static async updateBitcoinAddress(userId, bitcoinAddress) {
    return UserModel.findByIdAndUpdate(
      userId,
      { bitcoinAddress },
      { new: true },
    );
  }

  static async updateAccessToken(userId, accessToken) {
    return UserModel.findByIdAndUpdate(
      userId,
      { plaidAccessToken: accessToken },
      { new: true },
    );
  }
}

export default UserRepository;
