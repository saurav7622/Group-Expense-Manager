const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentVerificationSchema = new Schema({
  userId: {
    type: String,
  },
  uniqueString: {
    type: String,
  },
  receiverId: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

const PaymentVerification = mongoose.model(
  "PaymentVerification",
  PaymentVerificationSchema
);

module.exports = PaymentVerification;
