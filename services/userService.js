const User = require("../models/User");
const Movie = require("../models/Movie");
const Voucher = require("../models/Voucher");
const CryptoJS = require("crypto-js");

// create a new hashPassword

const hashPassword = (password) => {
    var newPassword = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET_KEY
    ).toString();
    return newPassword;
};

const NewUser = async (req) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const wallet_balance = req.body.wallet_balance;
    const point = req.body.point;

    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(user);
        if (user) {
            return {
                error: true,
                message: "Email is not valid!",
            };
        }
        const newPassword = hashPassword(password);
        const newUser = new User({
            username,
            email,
            password: newPassword,
            phone,
            wallet_balance,
            point,
        });

        await newUser.save();

        return {
            error: false,
            message: "Create new user  SuccessFully!",
            user,
        };
    } catch (err) {
        return {
            error: true,
            message: err.message,
        };
    }
};

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
// by movie
const postMovie = async (req) => {
    try {
        console.log(req);
        let user = await User.findById(req.user.id);
        let movie = await Movie.findOne({ _id: req.body.movie_id });
        if (!user) {
            return {
                error: true,
                message: "Not  found user!",
            };
        }

        if (!movie) {
            return {
                error: true,
                message: "Not found movie!",
            };
        }

        if (user.wallet_balance < movie.cost) {
            return {
                error: true,
                message: "You have not enough money!",
            };
        }
        let oldMovies = user.movies_list;

        // for (let obj of oldMovies) {
        //     if (obj.movie_id === movie._id) {
        //         obj.amount += 1;
        //         break;
        //     } else {
        //         oldMovies.push({
        //             movie_id: movie._id,
        //             title: movie.title,
        //             descripion: movie.desc,
        //             img: movie.img,
        //             year: movie.year,
        //             limit: movie.limit,
        //             genre: movie.genre,
        //             amount: 1,
        //         });
        //     }
        // }
        oldMovies.push({
            movie_id: movie._id,
            title: movie.title,
            descripion: movie.desc,
            img: movie.img,
            year: movie.year,
            limit: movie.limit,
            genre: movie.genre,
            amount: 1,
        });

        user.movies_list = oldMovies;

        user.wallet_balance -= movie.price;
        await user.save();
        return {
            error: false,
            message: "The movie has been added your movie list",
        };
    } catch (err) {
        return {
            error: true,
            message: err.message,
        };
    }
};
// change point to get voucher
const postVoucher = async (req) => {
    try {
        console.log(req.body.voucher_id);
        let user = await User.findById(req.user.id);
        let voucher = await Voucher.findOne({ _id: req.body.voucher_id });
        if (!user) {
            return {
                error: true,
                message: "User not found!",
            };
        }

        if (!voucher) {
            return {
                error: true,
                message: "Voucher not found!",
            };
        }

        if (user.point < voucher.point_cost) {
            return {
                error: true,
                message: "You are not  enough point to get voucher!",
            };
        }

        if (voucher.voucher_code.length <= 0) {
            return {
                error: true,
                message: "Voucher đã hết số lượng",
            };
        }

        let oldVoucherCodes = voucher.voucher_code;
        let voucherCode = oldVoucherCodes[0];
        oldVoucherCodes.shift();

        let oldVouchers = user.vouchers_list;
        let newVouchers = [];
        for (let i = 0; i < oldVouchers.length; i++) {
            newVouchers.push(oldVouchers[i]);
        }
        newVouchers.push({
            voucher_code: voucherCode,
            descripion: voucher.descripion,
            supplier_name: voucher.supplier_name,
            point_cost: voucher.point_cost,
            image: voucher.image,
        });

        voucher.voucher_code = oldVoucherCodes;
        user.vouchers_list = newVouchers;

        user.point -= voucher.point_cost;
        await voucher.save();
        await user.save();

        return {
            error: false,
            message: "Thêm voucher thành công",
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
    postMovie,
    postVoucher,
    NewUser,
};
