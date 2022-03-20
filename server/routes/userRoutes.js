const express = require("express");
const userController = require(`../controllers/userController`);
const authController = require(`../controllers/authController`);

const router = express.Router();

router.get("/getAllUsers", authController.protect, userController.getAllUsers);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.get(
  "/verify/:userId/:uniqueString",
  authController.emailVerificationRouteHandler
);
router.get("/verified", authController.emailVerifiedViewHandler);

router.get(
  "/Paymentverify/:userId/:timestamp/:uniqueString/:groupId/:amount",
  userController.paymentVerificationRouteHandler
);

router.get("/paymentVerified", userController.paymentVerifiedViewHandler);

router.get(
  "/Memberverify/:memberId/:timestamp/:uniqueString/:groupId",
  userController.memberVerificationRouteHandler
);

router.get("/memberVerified", userController.memberVerifiedViewHandler);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.get("/:userId", authController.protect, userController.getUserById);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.post(
  "/sendPaymentReminderEmail",
  authController.protect,
  userController.sendPaymentReminderEmail
);

router.post(
  "/sendPaymentConfirmationEmail",
  userController.uploadUserPhoto,
  userController.sendPaymentConfirmationEmail
);

router.post("/isRegistered", userController.isRegistered);

router.post(
  "/sendMemberConfirmationEmail",
  userController.sendMemberConfirmationEmail
);

router.post(
  "/checkMemberConfirmationStatus",
  userController.checkMemberConfirmationStatus
);

router.patch(
  "/removeVerificationMember",
  userController.removeVerificationMember
);

module.exports = router;
