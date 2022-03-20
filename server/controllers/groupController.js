const fs = require("fs");
const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const Group = require("./../models/groupModel");
const catchAsync = require("./../utils/catchAsync");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { content_v2_1 } = require("googleapis");
const GroupVerification = require("./../models/GroupVerificationModel");

exports.getAllGroups = catchAsync(async (req, res, next) => {
  const groups = await Group.find();

  res.status(200).json({
    status: "success",
    results: groups.length,
    data: {
      groups,
    },
  });
});

exports.getMyGroups = catchAsync(async (req, res, next) => {
  //console.log(req.params.userId);
  const user = await User.findOne({ _id: req.params.userId });
  if (!user) {
    return next(new AppError("No user found with that id!", 500));
  }

  const groupsJoined = user.groupsJoined;
  //console.log(groupsJoined);
  let myGroups = [];
  for (let i = 0; i < groupsJoined.length; i++) {
    const group = await Group.findOne({ _id: groupsJoined[i].groupId });
    myGroups.push(group);
  }

  res.status(200).json({
    status: "success",
    data: {
      myGroups,
    },
  });
});

exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findOne({ _id: req.params.id });
  //group.findOne({_id:req.params.id})

  if (!group) {
    return next(new AppError("No group found with that id!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      group,
    },
  });
});

exports.createGroup = catchAsync(async (req, res, next) => {
  // console.log(req.body);

  const newGroup = await Group.create(req.body);
  console.log("GROUP CREATED!!!!!!!!!!!!!");
  console.log(newGroup);
  res.status(201).json({
    status: "success",
    data: newGroup,
  });
});

exports.updateGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!group) {
    return next(new AppError("No group found with that id!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      group: group,
    },
  });
});

exports.pushLogToGroupDocument = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.body.groupId);
  //console.log(group);
  if (!group) {
    return next(new AppError("No group found with that id!", 404));
  }
  let logs = group.logs;
  logs.push({ logText: req.body.reminderMessage });
  try {
    await group.update({ _id: req.body.groupId }, { $set: { logs: logs } });
    await group.save();
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({
    status: "success",
    data: {
      group: group,
    },
  });
});

exports.createGroupVerification = catchAsync(async (req, res, next) => {
  const newVerification = await GroupVerification({
    name: req.body.groupName,
    worth: req.body.groupWorth,
  });
  newVerification.save();
  res.status(201).json({
    status: "success",
    data: newVerification,
  });
});

exports.createNewGroup = catchAsync(async (req, res, next) => {
  let groupObj = await GroupVerification.findById(req.body.groupId);
  const filteredMembers = groupObj.members.filter(
    (ob) => ob.confirmed === true
  );
  groupObj.members = filteredMembers;
  const user = await User.findOne({ email: req.body.email });
  const logMessage = `${user.name} created group ${groupObj.name}.`;
  groupObj.logs.push({ logText: logMessage });
  console.log(groupObj);
  let membersTemp = [];
  for (let i = 0; i < groupObj.members.length; i++) {
    let member = {
      memberId: groupObj.members[i].memberId,
      myShare: groupObj.members[i].myShare * 1,
      amountPaid: groupObj.members[i].amountPaid * 1,
      totalAmountPaid: groupObj.members[i].totalAmountPaid * 1,
      amountReceived: groupObj.members[i].amountReceived * 1,
    };
    membersTemp.push(member);
  }
  let groupObjTemp = {
    name: groupObj.name,
    worth: groupObj.worth * 1,
    members: membersTemp,
    logs: groupObj.logs,
  };
  const newGroup = await Group.create(groupObjTemp);

  await GroupVerification.deleteOne({ _id: req.body.groupId });

  for (let i = 0; i < groupObj.members.length; i++) {
    const user = await User.findOne({ email: groupObj.members[i].memberId });
    let groupsJoined = user.groupsJoined;
    groupsJoined.push({ groupId: newGroup._id });
    await User.updateOne(
      { email: groupObj.members[i].memberId },
      { groupsJoined }
    );
  }

  res.status(201).json({
    status: "success",
    data: newGroup,
  });
});

exports.deleteGroupVerification = catchAsync(async (req, res, next) => {
  const groupId = req.params.groupId;
  await GroupVerification.deleteOne({ _id: groupId });
  console.log("Group verification successfully deleted!!!!!");
  res.status(204).json({
    status: "success",
    data: null,
  });
});
