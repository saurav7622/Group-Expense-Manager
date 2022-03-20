const mongoose = require("mongoose");
const validator = require("validator");

const GroupVerificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A group must have a name!"],
    unique: true,
    trim: true,
    maxlength: [
      30,
      "A group name must have less than or equal to 30 characters!",
    ],
  },
  worth: {
    type: Number,
    required: [true, "A group must have worth value!"],
  },
  date: {
    type: Date,
    default: new Date(),
  },
  members: [
    {
      memberId: {
        type: String,
        unique: true,
        required: [true, "Please provide your email"],
        lowercase: true,
        validator: [validator.isEmail, "Please provide a valid email!"],
      },
      myShare: {
        type: Number,
        required: [true, "Please provide your share in the group!"],
      },
      amountPaid: {
        type: Number,
        required: [
          true,
          "Each group member should have its inital amount field!",
        ],
      },
      totalAmountPaid: {
        type: Number,
      },
      amountReceived: {
        type: Number,
        default: 0,
      },
      confirmed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  logs: [
    {
      date: {
        type: Date,
        default: new Date(),
      },
      logText: {
        type: String,
        trim: true,
      },
    },
  ],
  expiresAt: {
    type: Date,
    default: Date.now() + 24 * 60 * 60 * 1000,
  },
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
GroupVerificationSchema.pre("save", function (next) {
  console.log("Will save document...");
  next();
});

const GroupVerification = mongoose.model(
  "GroupVerification",
  GroupVerificationSchema
);

module.exports = GroupVerification;
