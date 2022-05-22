const User = require("../models/User");
const CryptoJS = require("crypto-js");
const updateUser = async (req) => {
    console.log(req.user);
    if (req.user.id === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString();
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            return {
                error: false,
                message: "Update SuccessFully!",
                updatedUser,
            };
        } catch (err) {
            return {
                error: true,
                message: err.message,
            };
        }
    } else {
        return {
            error: true,
            message: "You can't Update!",
        };
    }
};
// delte user
const deleteUser = async (req) => {
    console.log(req.params.id);
    if (req.user.id === req.params.id || req.user.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            return {
                error: false,
                message: "User has been deleted....",
            };
        } catch (err) {
            return {
                error: true,
                message: "You can't delete account!",
            };
        }
    }
};
//get user
const getUser = async (req) => {
    console.log(req.params.id);
    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        // const [password, ...info] = user._doc;
        return {
            error: false,
            message: "Get User SuccessFully!",
            user,
        };
    } catch (err) {
        return {
            error: true,
            message: err.message,
            // message: "Get user failure!",
        };
    }
};
// get all user
const getAllUser = async (req) => {
    const query = req.query.new;
    if (req.user.isAdmin) {
        try {
            const users = query
                ? await User.find().limit(5)
                : await User.find();
            return {
                error: false,
                message: "Get list user successfully!",
                users,
            };
        } catch (err) {
            return {
                error: true,
                message: err.message,
            };
        }
    } else {
        return {
            error: true,
            message: "You are not allowed to see all users!",
        };
    }
};
// get stats user
const getStateUsers = async (req) => {
    const today = new Date();
    const lastYear = today.setFullYear(today.setFullYear() - 1);
    try {
        const data = await User.aggregate([
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        return {
            error: false,
            message: "Get stats user successfully!",
            data,
        };
    } catch (err) {
        return {
            error: true,
            message: err.message,
        };
    }
};

module.exports = {
    updateUser,
    deleteUser,
    getUser,
    getAllUser,
    getStateUsers,
};
