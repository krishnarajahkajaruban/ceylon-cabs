const { Schema, model } = require("mongoose");

const registerUserSchema = new Schema(
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
    password: {
        type: String,
        required: true
      },
    role: {
      type: String,
      required: true,
      enum: ['Customer', "Driver", "Admin", "Operator"]
    }
  },
  { timestamps: true }
);

module.exports = model("registerUser", registerUserSchema);
