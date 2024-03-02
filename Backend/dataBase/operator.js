const { Schema, model } = require("mongoose");

const operatorSchema = new Schema(
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
      enum: ["Operator"]
    }
  },
  { timestamps: true }
);

module.exports = model("operator", operatorSchema);
