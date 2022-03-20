const mongoose = require("mongoose");
const validator = require("validator");

const groupSchema = new mongoose.Schema({
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
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
groupSchema.pre("save", function (next) {
  console.log("Will save document...");
  next();
});

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
