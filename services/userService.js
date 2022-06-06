const User = require("../models/User");
const Movie = require("../models/Movie");
const Voucher = require("../models/Voucher");
const CryptoJS = require("crypto-js");
const Vnpay = require("../models/Vnpay");
// const dateFormat = require("dateformat");
// const { dateFormat, masks } = require("dateformat");
// import dateformat from "dateformat"
// import dateformat from "dateformat";
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

        if (user.wallet_balance < movie.price) {
            return {
                error: true,
                message: "You have not enough money!",
            };
        }
        let oldMovies = user.movies_list;

        oldMovies.push({
            movie_id: movie._id,
        });

        user.movies_list = oldMovies;

        user.wallet_balance -= movie.price;
        user.point += 4;
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
            message: "The voucher has been added on your voucher successfully!",
        };
    } catch (err) {
        return {
            error: true,
            message: err.message,
        };
    }
};

const vnpayPayment = async (req) => {
    try {
        var ipAddr = "127.0.0.1";
        var tmnCode = "D5BZR8VD";
        var secretKey = "TPJRYMTJMLBXCXHZWPNKWKHDHYNPFTWV";
        var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        var returnUrl = encodeURIComponent("http://localhost:3000/donepayment");

        var date = new Date();

        var dateFormat = require("date-format");
        // // var dateFormat = dateformat;

        var createDate = dateFormat(date, "yyyymmddHHmmss");
        var orderId = dateFormat(date, "HHmmss");
        var amount = req.body.amount;

        var orderInfo = encodeURIComponent(req.body.orderDescription);
        var orderType = req.body.orderType;
        var locale = req.body.language;
        if (locale === null || locale === "") {
            locale = "vn";
        }
        var currCode = "VND";
        var vnp_Params_old = {};
        vnp_Params_old["vnp_Version"] = "2.1.0";
        vnp_Params_old["vnp_Command"] = "pay";
        vnp_Params_old["vnp_TmnCode"] = tmnCode;
        // vnp_Params_old['vnp_Merchant'] = ''
        vnp_Params_old["vnp_Locale"] = locale;
        vnp_Params_old["vnp_CurrCode"] = currCode;
        vnp_Params_old["vnp_TxnRef"] = orderId;
        vnp_Params_old["vnp_OrderInfo"] = orderInfo;
        vnp_Params_old["vnp_OrderType"] = orderType;
        vnp_Params_old["vnp_Amount"] = amount * 100;
        // vnp_Params_old["vnp_ReturnUrl"] = returnUrl;
        vnp_Params_old["vnp_IpAddr"] = ipAddr;
        vnp_Params_old["vnp_CreateDate"] = createDate;
        // if(bankCode !== null && bankCode !== ''){
        //     vnp_Params_old['vnp_BankCode'] = bankCode;
        // }

        const vnp_Params = Object.keys(vnp_Params_old)
            .sort()
            .reduce((obj, key) => {
                obj[key] = vnp_Params_old[key];
                return obj;
            }, {});

        var querystring = require("qs");
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

        console.log(vnp_Params);

        console.log(vnpUrl);

        return {
            error: false,
            message: "Chuyển hướng thanh toán",
            vnpayUrl: vnpUrl,
        };
    } catch (err) {
        return {
            error: true,
            message: err.message,
        };
    }
};

const vnpayIpn = async (req) => {
    try {
        var vnp_Params_old = req.body;
        var secureHash = vnp_Params_old["vnp_SecureHash"];

        delete vnp_Params_old["vnp_SecureHash"];

        const vnp_Params = Object.keys(vnp_Params_old)
            .sort()
            .reduce((obj, key) => {
                obj[key] = vnp_Params_old[key];
                return obj;
            }, {});

        var secretKey = "TPJRYMTJMLBXCXHZWPNKWKHDHYNPFTWV";
        var querystring = require("qs");
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

        if (secureHash === signed) {
            const transactionNo = vnp_Params["vnp_TransactionNo"];
            const vnpay = await Vnpay.findOne({
                vnp_TransactionNo: transactionNo,
            });

            if (!vnpay) {
                const user = await User.findById(req.params.id);

                var orderId = vnp_Params["vnp_TxnRef"];
                var rspCode = vnp_Params["vnp_ResponseCode"];
                var money = vnp_Params["vnp_Amount"];

                user.wallet_balance += parseInt(money) / 100;

                const newVnpay = new Vnpay({
                    vnp_Amount: vnp_Params["vnp_Amount"],
                    vnp_BankCode: vnp_Params["vnp_BankCode"],
                    vnp_BankTranNo: vnp_Params["vnp_BankTranNo"],
                    vnp_CardType: vnp_Params["vnp_CardType"],
                    vnp_OrderInfo: vnp_Params["vnp_OrderInfo"],
                    vnp_TransactionNo: vnp_Params["vnp_TransactionNo"],
                    vnp_TmnCode: vnp_Params["vnp_TmnCode"],
                    vnp_PayDate: vnp_Params["vnp_PayDate"],
                });

                newVnpay.save();
                user.save();

                return {
                    error: false,
                    message: "Thanh toán thành công",
                    paymentInfo: {
                        vnp_Amount: parseInt(vnp_Params["vnp_Amount"]) / 100,
                        vnp_BankCode: vnp_Params["vnp_BankCode"],
                        vnp_BankTranNo: vnp_Params["vnp_BankTranNo"],
                        vnp_CardType: vnp_Params["vnp_CardType"],
                        vnp_OrderInfo: vnp_Params["vnp_OrderInfo"],
                        vnp_PayDate: vnp_Params["vnp_PayDate"],
                    },
                    userInfo: {
                        name: user.username,
                        email: user.email,
                    },
                };
            } else {
                return {
                    error: true,
                    message: "Giao dịch đã được xử lí",
                };
            }
        } else {
            return {
                error: true,
                message: "Lỗi checksum",
            };
        }
    } catch (err) {
        return {
            err: true,
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
    vnpayIpn,
    vnpayPayment,
};
