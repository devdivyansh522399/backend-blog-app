const express = require("express");
const { requireSignIn } = require("../middlewares/authMiddleware");
const { createPost } = require("../controllers/postController");
const router = express.Router();

router.post('createpost', requireSignIn, createPost)

module.exports = router;