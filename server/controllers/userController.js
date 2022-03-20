const fs = require("fs");
const User = require("./../models/userModel");
const Group = require("./../models/groupModel");
const AppError = require("../utils/appError");
const PaymentVerification = require("./../models/PaymentVerificationModel");
const GroupVerification = require("./../models/GroupVerificationModel");
const MemberVerification = require("./../models/MemberVerificationModel");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const catchAsync = require("./../utils/catchAsync");
const sendEmail = require("./../utils/email");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `user-${req.headers.id}-${Date.now()}.${extension}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single("photo");

let users = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/users.json`));
let currentTimestamp;
let memberVerificationTimestamp;

const createSaveHashedUniqueStringForMemberVerification = catchAsync(
  async (memberId, uniqueString, groupId) => {
    const saltRounds = 10;
    const hashedUniqueString = await bcrypt.hash(uniqueString, saltRounds);
    if (!hashedUniqueString) {
      return next(
        new AppError("An error occured while hashing email data", 500)
      );
    }
    const newVerification = new MemberVerification({
      memberId,
      uniqueString: hashedUniqueString,
      groupId,
      createdAt: String(memberVerificationTimestamp),
    });
    newVerification.save();
  }
);

exports.memberVerificationRouteHandler = catchAsync(async (req, res, next) => {
  let { memberId, timestamp, uniqueString, groupId } = req.params;
  try {
    const verifications = await MemberVerification.find({
      memberId,
      groupId,
      createdAt: timestamp,
    });
    if (verifications.length > 0) {
      //user verification record exist so we proceed
      const hashedUniqueString = verifications[0].uniqueString;

      //valid record exists so we validate the user string
      //First compare the hashed unique string
      try {
        const result = await bcrypt.compare(uniqueString, hashedUniqueString);
        if (result) {
          //strings match
          console.log("String matched!");

          const groupVerification = await GroupVerification.findById(groupId);
          let members = groupVerification.members;
          for (let i = 0; i < members.length; i++) {
            if (members[i]._id == memberId) {
              members[i].confirmed = true;
              break;
            }
          }

          await GroupVerification.updateOne({ _id: groupId }, { members });

          try {
            //(await User.updateOne({ _id: userId }, { verified: true }));
            try {
              await MemberVerification.deleteOne({
                memberId,
                groupId,
                createdAt: timestamp,
              });
              res.sendFile(
                path.join(__dirname, "./../views/memberVerified.html")
              );
            } catch (err) {
              console.log(err);
              let message =
                "An error occured while finalizing successful verification.";
              res.redirect(
                `/users/memberVerified/error=true&message=${message}`
              );
              res.sendFile(
                path.join(__dirname, "./../views/memberVerified.html")
              );
            }
          } catch (err) {
            console.log(err);
            let message =
              "An error occured while updating member record to show verified.";
            res.redirect(`/users/memberVerified/error=true&message=${message}`);
            res.sendFile(
              path.join(__dirname, "./../views/memberVerified.html")
            );
          }
        } else {
          //existing record but incorrect verification details passed
          let message = `Invalid verification details passed.Please check the indbox.`;
          res.redirect(`/users/memberVerified/error=true&message=${message}`);
          res.sendFile(path.join(__dirname, "./../views/memberVerified.html"));
        }
      } catch (err) {
        let message = `An error occured while comparing unique strings.`;
        res.redirect(`/users/memberVerified/error=true&message=${message}`);
        res.sendFile(path.join(__dirname, "./../views/memberVerified.html"));
      }
    } else {
      //user verification record doesn't exist
      let message = "Member record doesn't exist or has been verified already.";
      res.redirect(`/users/memberVerified/error=true&message=${message}`);
      res.sendFile(path.join(__dirname, "./../views/memberVerified.html"));
    }
  } catch (err) {
    console.log(err);
    let message =
      "An error occured while checking for existing member verification record";
    res.redirect(`/users/memberVerified/error=true&message=${message}`);
    res.sendFile(path.join(__dirname, "./../views/memberVerified.html"));
  }
});

exports.memberVerifiedViewHandler = catchAsync(async (req, res) => {
  res.sendFile(path.join(__dirname, "./../views/memberVerified.html"));
  //res.sendFile(path.join(__dirname, "./../views/paymentVerified.html"));
});

const createSaveHashedUniqueString = catchAsync(
  async (uniqueString, _id, receiverId, next) => {
    const saltRounds = 10;
    const hashedUniqueString = await bcrypt.hash(uniqueString, saltRounds);
    if (!hashedUniqueString) {
      return next(
        new AppError("An error occured while hashing email data", 500)
      );
    }
    const newVerification = new PaymentVerification({
      userId: _id,
      uniqueString: hashedUniqueString,
      receiverId,
      createdAt: String(currentTimestamp),
    });
    newVerification.save();
  }
);

exports.paymentVerificationRouteHandler = catchAsync(async (req, res, next) => {
  let { userId, timestamp, uniqueString, groupId, amount } = req.params;
  try {
    const verifications = await PaymentVerification.find({
      userId,
      createdAt: timestamp,
    });
    if (verifications.length > 0) {
      //user verification record exist so we proceed
      const hashedUniqueString = verifications[0].uniqueString;

      //valid record exists so we validate the user string
      //First compare the hashed unique string
      try {
        const result = await bcrypt.compare(uniqueString, hashedUniqueString);
        if (result) {
          //strings match
          console.log("String matched!");
          const receiverId = verifications[0].receiverId;
          const userId = verifications[0].userId;
          const group = await Group.findById(groupId);
          const user = await User.findById(userId);
          const receiver = await User.findById(receiverId);
          let members = group.members;
          for (let i = 0; i < members.length; i++) {
            if (members[i].memberId === user.email) {
              members[i].totalAmountPaid =
                members[i].totalAmountPaid * 1 + amount * 1;
            }
            if (members[i].memberId === receiver.email) {
              members[i].amountReceived =
                members[i].amountReceived * 1 + amount * 1;
            }
          }

          let logs = group.logs;
          const logText = `A payment of Rs ${amount} from ${user.email} to ${receiver.email} is confirmed.`;
          const logObj = {
            logText,
          };
          logs.push(logObj);
          await Group.updateOne({ _id: groupId }, { members });
          await Group.updateOne({ _id: groupId }, { logs });
          try {
            //(await User.updateOne({ _id: userId }, { verified: true }));
            try {
              await PaymentVerification.deleteOne({
                userId,
                createdAt: timestamp,
              });
              res.sendFile(
                path.join(__dirname, "./../views/paymentVerified.html")
              );
            } catch (err) {
              console.log(err);
              let message =
                "An error occured while finalizing successful verification.";
              res.redirect(`/users/verified/error=true&message=${message}`);
              res.sendFile(
                path.join(__dirname, "./../views/paymentVerified.html")
              );
            }
          } catch (err) {
            console.log(err);
            let message =
              "An error occured while updating payment record to show verified.";
            res.redirect(
              `/users/paymentVerified/error=true&message=${message}`
            );
            res.sendFile(
              path.join(__dirname, "./../views/paymentVerified.html")
            );
          }
        } else {
          //existing record but incorrect verification details passed
          let message = `Invalid verification details passed.Please check the indbox.`;
          res.redirect(`/users/paymentVerified/error=true&message=${message}`);
          res.sendFile(path.join(__dirname, "./../views/paymentVerified.html"));
        }
      } catch (err) {
        let message = `An error occured while comparing unique strings.`;
        res.redirect(`/users/paymentVerified/error=true&message=${message}`);
        res.sendFile(path.join(__dirname, "./../views/paymentVerified.html"));
      }
    } else {
      //user verification record doesn't exist
      let message =
        "Payment record doesn't exist or has been verified already.";
      res.redirect(`/users/paymentVerified/error=true&message=${message}`);
      res.sendFile(path.join(__dirname, "./../views/paymentVerified.html"));
    }
  } catch (err) {
    console.log(err);
    let message =
      "An error occured while checking for existing payment verification record";
    res.redirect(`/users/paymentVerified/error=true&message=${message}`);
    res.sendFile(path.join(__dirname, "./../views/paymentVerified.html"));
  }
});

exports.paymentVerifiedViewHandler = catchAsync(async (req, res) => {
  res.sendFile(path.join(__dirname, "./../views/paymentVerified.html"));
  //res.sendFile(path.join(__dirname, "./../views/paymentVerified.html"));
});

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
};

exports.createUser = (req, res) => {
  users.push(req.body);
  fs.writeFile(
    `${__dirname}/../dev-data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          users,
        },
      });
    }
  );
};

exports.getUserById = catchAsync(async (req, res, next) => {
  console.log(req.params.userId);
  const user = await User.findOne({ _id: req.params.userId });
  if (!user) {
    return next(new AppError("No user found with that id!", 500));
  }
  console.log(user);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.sendPaymentReminderEmail = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.body.groupId);
  const mailOptions = {
    email: req.body.receiver,
    subject: "Payment Reminder",
    message: `<p><span color="blue">${req.body.sender}</span> has reminded you to pay Rs <b>${req.body.amount}</b> for the group <em>${group.name}</em></p>`,
  };
  try {
    await sendEmail(mailOptions);

    res.status(200).json({
      status: "success",
      message: "Reminder Email successfully sent!",
    });
  } catch (err) {
    return next(
      new AppError("There was an error sending the email.Try again!", 500)
    );
  }
});

exports.sendPaymentConfirmationEmail = catchAsync(async (req, res, next) => {
  const currentUrl = "https://group-expense-manager-api.herokuapp.com/";

  const uniqueString = uuidv4() + req.headers.id;

  const group = await Group.findById(req.body.groupId);
  const receiver = await User.findOne({ email: req.body.receiver });
  const receiverId = receiver._id;
  currentTimestamp = Date.now();
  const confirmationMessage = `<p><strong>${
    req.body.sender
  }</strong> is proposing that he has paid Rs <strong>${
    req.body.amount
  }</strong> to you via <strong>${req.body.means}</strong> for the group <em>${
    group.name
  }</em>.So, click on <a href="${
    currentUrl +
    "api/v1/users/Paymentverify/" +
    req.headers.id +
    "/" +
    currentTimestamp +
    "/" +
    uniqueString +
    "/" +
    req.body.groupId +
    "/" +
    req.body.amount
  }">here</a> to confirm his ask and in order for the payment information to get updated in the application.</p>`;
  const mailOptions = {
    email: req.body.receiver,
    subject: "Ask for Payment Confirmation",
    message: confirmationMessage,
    attachments: req.file
      ? [
          {
            filename: "payment_proof.jpeg",
            path: `${req.file.path}`,
            cid: "cid:uniqueID@create.ee",
          },
        ]
      : "",
  };
  try {
    await sendEmail(mailOptions);
  } catch (err) {
    console.log(err);
    return next(
      new AppError("There was an error sending the email.Try again!", 500)
    );
  }

  const saltRounds = 10;
  createSaveHashedUniqueString(uniqueString, req.headers.id, receiverId, next);

  if (req.file)
    fs.unlink(`${req.file.path}`, function (err) {
      if (err) {
        return next(new AppError("There was an error deleting the file.", 500));
      }
    });
  res.status(200).json({
    status: "success",
    message: "Payment Confirmation Email successfully sent!",
  });
});

exports.isRegistered = catchAsync(async (req, res, next) => {
  const users = await User.find();
  let isRegistered = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === req.body.emailId) {
      isRegistered = true;
      break;
    }
  }
  res.status(200).json({
    status: "success",
    data: {
      isRegistered,
    },
  });
});

exports.checkMemberConfirmationStatus = catchAsync(async (req, res, next) => {
  const groupVerification = await GroupVerification.findOne({
    _id: req.body.groupId,
  });
  let isConfirmed = false;
  const members = groupVerification.members;
  for (let i = 0; i < members.length; i++) {
    if (
      members[i].memberId === req.body.gmail &&
      members[i].confirmed == true
    ) {
      isConfirmed = true;
      break;
    }
  }
  console.log(isConfirmed);
  res.status(200).json({
    status: "success",
    data: {
      isConfirmed,
    },
  });
});

exports.sendMemberConfirmationEmail = catchAsync(async (req, res, next) => {
  const verification = await GroupVerification.findById(req.body.groupId);
  if (!verification) {
    return next(
      new AppError(
        "There was no group verification found with the given id!",
        404
      )
    );
  }
  let members = verification.members;
  const memberObj = {
    memberId: req.body.receiver,
    myShare: req.body.share,
    amountPaid: req.body.amountPaid,
    totalAmountPaid: req.body.amountPaid,
    amountReceived: 0,
    confirmed: false,
  };
  members.push(memberObj);
  await GroupVerification.updateOne({ _id: req.body.groupId }, { members });
  const groupVerification = await GroupVerification.findOne({
    _id: req.body.groupId,
  });
  const member = groupVerification.members.find(
    (el) => el.memberId === req.body.receiver
  );
  const currentUrl = "https://group-expense-manager-api.herokuapp.com/";
  const uniqueString = uuidv4() + member._id;
  memberVerificationTimestamp = Date.now();
  const confirmationMessage = `<p>Please <a href="${
    currentUrl +
    "api/v1/users/Memberverify/" +
    member._id +
    "/" +
    memberVerificationTimestamp +
    "/" +
    uniqueString +
    "/" +
    req.body.groupId
  }">confirm</a> your contribution data for the new group being formed namely <em>${
    req.body.groupName
  }.</em><ol><li>Total Bill Splitted: <b>Rs ${
    req.body.groupWorth
  }</b></li><li>Your share: <b>Rs ${
    req.body.share
  }</b></li><li>Currently Paying: <b>Rs ${
    req.body.amountPaid
  }</b></li></ol></p>`;

  const mailOptions = {
    email: req.body.receiver,
    subject: "Group Member Data Confirmation",
    message: confirmationMessage,
  };

  try {
    await sendEmail(mailOptions);
    createSaveHashedUniqueStringForMemberVerification(
      member._id,
      uniqueString,
      req.body.groupId,
      next
    );
    res.status(200).json({
      status: "success",
      data: {
        memberId: member._id,
      },
    });
  } catch (err) {
    console.log(err);
    return next(
      new AppError("There was an error sending the email.Try again!", 500)
    );
  }
});

exports.removeVerificationMember = catchAsync(async (req, res, next) => {
  const groupVerification = await GroupVerification.findOne({
    _id: req.body.groupId,
  });
  let members = groupVerification.members;
  let newMembers = [];
  for (let i = 0; i < members.length; i++) {
    if (members[i].memberId !== req.body.gmail) {
      newMembers.push(members[i]);
    }
  }
  await GroupVerification.updateOne(
    { _id: req.body.groupId },
    { members: newMembers }
  );
  res.status(200).json({
    status: "success",
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const usersTemp = await User.find();
  let users = [];
  for (let i = 0; i < usersTemp.length; i++) {
    let userInfo = {
      name: usersTemp[i].name,
      email: usersTemp[i].email,
      contactNo: usersTemp[i].contactNo,
    };
    users.push(userInfo);
  }
  res.status(200).json({
    status: "success",
    data: { users: users },
  });
});
