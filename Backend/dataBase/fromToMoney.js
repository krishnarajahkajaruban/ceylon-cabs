const { Schema, model } = require("mongoose");

const fromToMoneySchema = new Schema(
  { 
    from: {
      type: String,
      required: true,
      lowercase: true  // Store values in lowercase
    },
    to: {
      type: String,
      required: true,
      lowercase: true  // Store values in lowercase
    },
    money: {
      type: String,
      required: true
    },
    driverId: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
);

module.exports = model("fromToMoney", fromToMoneySchema);
