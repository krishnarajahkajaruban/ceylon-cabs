const { Schema, model } = require("mongoose");

const bookingDetailByOperatorSchema = new Schema(
  { 
    id: {
      type: String,
      required: true
    },
    driverId: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    customerId: {
      type: String,
      required: true
    },
    customerEmail: {
        type: String,
        required: true
    },
    operatorId: {
      type: String,
      required: true
    },
    from: {
        type: String,
        required: true
      },
    to: {
      type: String,
      required: true
    },
    money: {
        type: String,
        required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', "Completed", "Rejected"]
    },
    pickUpLocation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("bookingDetailByOperator", bookingDetailByOperatorSchema);
