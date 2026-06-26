import UserModel from "../models/user.model.js";

const findByEmail = async (email, includePassword = false) => {
    if (includePassword) {
        return UserModel
            .findOne({ email })
            .select("+password");
    }

    return UserModel.findOne({ email });
};

const createUser = async (userData) => {
    return UserModel.create(userData);
};

const findById = async (id) => {
    return UserModel.findById(id);
};

const userRepository = {
    findByEmail,
    findById,
    createUser,
};

export default userRepository;