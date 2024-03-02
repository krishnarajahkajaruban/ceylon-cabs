const { Schema, model } = require("mongoose");

const customerSchema = new Schema(
  { 
    id: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    phoneNum: {
      type: Number,
      unique: true,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ["Customer"]
    }
  },
  { timestamps: true }
);

module.exports = model("customer", customerSchema);
