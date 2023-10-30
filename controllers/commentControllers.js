const commentModel = require("../models/commentModel");
const postModel = require("../models/postModel");

const createComment = async (req, res) => {
  try {
    const { desc, slug, parent, replyOnUser } = req.body;
    const post = await postModel.findOne({ slug: slug });
    if (!post) {
      return res.json({
        status: false,
        message: "Post not found",
      });
    }
    const newComment = new commentModel({
      user: req.user._id,
      desc: desc,
      post: post._id,
      parent: parent,
      replyOnUser: replyOnUser,
    });

    const savedComment = await newComment.save();
    return res.status(200).send({
      message: "comment created",
      success: true,
      comment: savedComment,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error in Comment creation",
    });
  }
};

const updateComment = async (req, res) => {
  try {
    const { desc } = req.body;

    const comment = await commentModel.findById(req.params.commentId);

    if (!comment) {
      return res.json({
        status: false,
        message: "Comment was not found",
      });
    }

    comment.desc = desc || comment.desc;

    const updatedComment = await comment.save();
    return res.json({
      success: true,
      message: "Comment updated",
      updatedComment,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error in Comment creation",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await commentModel.findByIdAndDelete(req.params.commentId);
    await commentModel.deleteMany({ parent: comment._id });

    if (!comment) {
      return res.json({
        status: false,
        message: "Comment was not found",
      });
    }

    return res.json({
      success: true,
      message: "Comment is deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Error in Comment deletion",
    });
  }
};

module.exports = { createComment, updateComment, deleteComment};
