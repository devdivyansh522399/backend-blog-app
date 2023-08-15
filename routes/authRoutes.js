const express = require("express");
const {
  registerController,
  loginController,
  userProfile,
  updateProfile,
  profilePicture
} = require("../controllers/authController");
const { requireSignIn } = require("../middlewares/authMiddleware");
const upload = require("../utils/multer");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/profile/:userId", requireSignIn, userProfile);
router.put("/profile/:userId", requireSignIn, updateProfile);
router.put("/profilepicture/:userId", requireSignIn,upload.single("profilePicture"), profilePicture);

module.exports = router;
