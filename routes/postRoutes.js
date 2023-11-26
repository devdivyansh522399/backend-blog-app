const express = require("express");
const { requireSignIn } = require("../middlewares/authMiddleware");
const {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
} = require("../controllers/postController");
const upload = require("../utils/multer");
const router = express.Router();
router.post("/", requireSignIn,upload.single("postPicture"), createPost);
router.put("/:slug", requireSignIn, upload.singe("postPicture"), updatePost);
router.delete("/:slug ", requireSignIn, deletePost);
router.get("/:slug", getPost);
router.get("/", getAllPosts);
module.exports = router;
