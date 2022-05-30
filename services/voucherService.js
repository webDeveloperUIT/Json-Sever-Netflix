var Voucher = require("../models/Voucher");
var voucher_codes = require("voucher-code-generator");
async function addVoucher(reqVoucher) {
    if (reqVoucher.user.isAdmin) {
        const {
            amount_voucher_code,
            description,
            category,
            supplier_name,
            point_cost,
            image,
        } = reqVoucher.body;
        let voucher_code = voucher_codes.generate({
            length: 8,
            count: 5,
        });
        const newVoucher = new Voucher({
            voucher_code,
            description,
            category,
            supplier_name,
            point_cost,
            image,
        });
        // const newVoucher = new Voucher(reqVoucher.body);

        try {
            await newVoucher.save();
            return {
                error: false,
                message: "Create voucher successfully!",
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
            message: "Create voucher failure",
        };
    }
}

async function getVouchers(page) {
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

        const total = await Voucher.countDocuments();
        const vouchers = await Voucher.find()
            .sort({ _id: -1 })
            .limit(LIMIT)
            .skip(startIndex);
        return {
            error: false,
            message: `Get voucher page ${page}successfully!`,
            current_page: Number(page),
            number_of_pages: Math.ceil(total / LIMIT),
            vouchers,
        };
    } catch (err) {
        return {
            error: true,
            message: err.message,
        };
    }
}

async function getVouchersBySearch(searchKey) {
    try {
        const description = new RegExp(searchKey, "i");

        const vouchers = await Voucher.find({ description });

        return {
            error: false,
            message: `The voucher has beeen found....`,
            vouchers,
        };
    } catch (err) {
        return {
            error: true,
            message: err.message,
        };
    }
}

async function getVoucher(voucherId) {
    try {
        const voucher = await Voucher.findById(voucherId);

        if (!voucher) {
            return {
                error: true,
                message: "The voucher hasn't been found",
            };
        }

        return {
            error: false,
            message: "Get voucher successfully!",
            voucher: {
                description: voucher.description,
                supplier_name: voucher.supplier_name,
                point_cost: voucher.point_cost,
                image: voucher.image,
            },
        };
    } catch (err) {
        return {
            err: true,
            message: err.message,
        };
    }
}

async function updateVoucher(req) {
    if (req.user.isAdmin) {
        try {
            const voucher = await Voucher.findById(req.params.id);
            if (!voucher) {
                return {
                    error: true,
                    message: "The voucher hasn't been found...",
                };
            }

            const updatedVoucher = await Voucher.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );

            return {
                error: false,
                message: "Update voucher successfully!",
                data: updatedVoucher,
            };
        } catch (err) {
            return {
                err: true,
                message: err.message,
            };
        }
    } else {
        return {
            error: true,
            message: "Update movie failure!",
        };
    }
}

async function deleteVoucher(voucherId) {
    try {
        const voucher = await Voucher.findById(voucherId);
        if (!voucher) {
            return {
                error: true,
                message: "The voucher hasn't been found...",
            };
        }

        const deletedVoucher = await Voucher.findByIdAndDelete(voucherId);

        return {
            error: false,
            message: "Delete voucher successfully!",
        };
    } catch (err) {
        return {
            err: true,
            message: err.message,
        };
    }
}

module.exports = {
    addVoucher,
    getVouchers,
    getVouchersBySearch,
    getVoucher,
    updateVoucher,
    deleteVoucher,
};
