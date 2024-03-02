const { Schema, model } = require("mongoose");

const contactUsSchema = new Schema(
  { 
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true
    },
    msg: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = model("contactUs", contactUsSchema);
