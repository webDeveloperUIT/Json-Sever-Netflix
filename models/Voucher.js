const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoucherSchema = new Schema(
  {
    image: {
      type: String,
    },

    voucher_code: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    supplier_name: {
      type: String,
      required: true,
    },
    point_cost: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Voucher", VoucherSchema);
