const express = require("express");
const {
  registerController,
  loginController,
  userProfile,
  updateProfile,
  forgotPasswordController,
  updateProfilePicture
} = require("../controllers/authController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/profile/:userId", requireSignIn, userProfile);
router.put("/profile/:userId", requireSignIn, updateProfile);
router.put("/updateprofilepicture/:userId", requireSignIn, updateProfilePicture);

module.exports = router;
