const express = require("express");
const { requireSignIn } = require("../middlewares/authMiddleware");
const { createComment, updateComment, deleteComment } = require("../controllers/commentControllers");
const router = express.Router();

router.post('/', requireSignIn, createComment);
router.put('/:commentId', requireSignIn, updateComment);
router.delete('/:commentId', requireSignIn, deleteComment);
module.exports = router;

