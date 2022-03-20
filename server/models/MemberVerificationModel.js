const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemberVerificationSchema = new Schema({
  memberId: {
    type: String,
  },
  uniqueString: {
    type: String,
  },
  groupId: {
    type: String,
  },
  createdAt:{
      type:String,
  },
});

const MemberVerification = mongoose.model(
  "MemberVerification",
  MemberVerificationSchema
);

module.exports = MemberVerification;
