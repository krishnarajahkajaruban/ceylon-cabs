const { Schema, model } = require("mongoose");

const driverSchema = new Schema(
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
    availability: {
        type: Boolean,
        required: true
      },
    rating: {
        type: Number,
        required: true
      },
    role: {
      type: String,
      required: true,
      enum: ["Driver"]
    }
  },
  { timestamps: true }
);

module.exports = model("driver", driverSchema);
