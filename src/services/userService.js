const { User } = require('../models/user');

const createUser = async (userData) => {
    try {
        const user = await User.create(userData);
        return user;
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

const findUserById = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        return user;
    } catch (error) {
        throw new Error('Error finding user: ' + error.message);
    }
};

const updateUser = async (userId, updateData) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await user.update(updateData);
        return user;
    } catch (error) {
        throw new Error('Error updating user: ' + error.message);
    }
};

module.exports = {
    createUser,
    findUserById,
    updateUser,
};