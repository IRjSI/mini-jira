import UserModel from "../models/user.model.js";

const findByEmail = async (email) => {
    return UserModel.findOne({ email });
};

const findByEmailWithPassword = async (email) => {
    return UserModel
        .findOne({ email })
        .select("+password");
};

const createUser = async (userData) => {
    return UserModel.create(userData);
};

const findById = async (id) => {
    return UserModel.findById(id);
};

const updateRefreshToken = async (userId, refreshToken) => {
    return UserModel.findByIdAndUpdate(
        userId,
        {
            refreshToken,
        },
        {
            new: true,
        }
    );
};

const userRepository = {
    findByEmail,
    findByEmailWithPassword,
    findById,
    createUser,
};

export default userRepository;