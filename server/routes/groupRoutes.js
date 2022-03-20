const express = require("express");
const groupController = require("./../controllers/groupController");
const authController = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, groupController.getAllGroups)
  .post(groupController.createGroup);

router
  .route("/myGroups/:userId")
  .get(authController.protect, groupController.getMyGroups);

router.route("/:id").get(authController.protect, groupController.getGroup);
router
  .route("/pushLogToGroupDocument")
  .patch(authController.protect, groupController.pushLogToGroupDocument);

router.post(
  "/createGroupVerification",
  authController.protect,
  groupController.createGroupVerification
);

router.post("/createNewGroup", groupController.createNewGroup);

router.delete(
  "/deleteGroupVerification/:groupId",
  groupController.deleteGroupVerification
);

module.exports = router;
