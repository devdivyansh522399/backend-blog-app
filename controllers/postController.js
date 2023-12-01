const postModel = require("../models/postModel");
const userModel = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const commentModel = require('../models/commentModel')
const v4 = require("uuid");
const uuidv4 = v4.v4;
//REGISTER API

cloudinary.config({
  cloud_name: "diwkbswnz",
  api_key: 366464522325271,
  api_secret: "UunZT6aGwS7xPkxdfT7j_H0vv5w",
});

const createPost = async (req, res) => {
  try {
    let user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `/Blog-App/Post/${user.name}${user._id}/`,
    });
    const post = new postModel({
      title: req.body.title,
      caption: req.body.caption,
      slug: uuidv4(),
      photo: result.secure_url,
      body: req.body.Body,
      user: req.body.userId,
      tags: req.body.tags,
      category: req.body.category,
      public_id: result.public_id,
    });

    const createdPost = await post.save();
    return res.json(createdPost);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Creating Post",
      error,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    let user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }
    const slug = req.params?.slug || null;
    const post = await postModel.findOne({ slug: slug });
    if (!post) {
      return res.status(400).send({
        success: false,
        message: "Post not found",
        error,
      });
    }
    let result;
    console.log(post);
    if (req?.file?.path) {
      const deleteResponse = await cloudinary.uploader.destroy(post.public_id);
      console.log(deleteResponse);
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: `/Blog-App/Post/${user.name}${user._id}/`,
      });
      console.log(result);
    }
    if (req.body) {
      post.title = req.body.title || post.title;
      post.caption = req.body.caption || post.caption;
      post.photo = result.secure_url || post.photo;
      post.body = req.body.Body || post.body;
      post.tags = req.body.tags || post.tags;
      post.category = req.body.category || post.category;
      post.public_id = result.public_id;
    }
    const updatedPost = await post.save();
    res.status(200).send({
      success: true,
      message: "Post Updated",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Post Updated",
      error,
    });
  }
};
const deletePost = async (req, res) => {
  try {
    console.log("hhi from deletepost")
    const slug = req.params?.slug;
    const post = await postModel.findOne({ slug: slug });
    if (!post) {
      return res.status(400).send({
        success: false,
        message: "Post not found",
        error,
      });
    }
    const deleteResponse = await cloudinary.uploader.destroy(post.public_id);
    const result = await postModel.findOneAndDelete({ slug: req.params.slug });
    await commentModel.deleteMany({ post: post._id });
    res.status(200).send({
      success: true,
      message: "Post Deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Post Updated",
      error,
    });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await postModel.findOne({ slug: req.params.slug }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "comments",
        match: {
          parent: null,
        },
        populate: [
          {
            path: "user",
            select: ["avatar", "name"],
          },
          {
            path: "replies",
            populate: [
              {
                path: "user",
                select: ["avatar", "name"],
              },
            ],
          },
        ],
      },
    ]);

    if (!post) {
      return res.status(400).send({
        success: false,
        message: "Post not found",
        error,
      });
    }
    res.status(200).send({
      success: true,
      message: "Post found",
      post: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Post Updated",
      error,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const post = await postModel
      .find({})
      .populate([
        {
          path: "user",
          select: ["avatar", "name", "verified"],
        },
      ])
      .sort({ createdAt: -1 })
      .limit(50);
    if (!post) {
      return res.status(400).send({
        success: false,
        message: "Posts not found",
        error,
      });
    }
    res.status(200).send({
      success: true,
      message: "Posts found",
      post: post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting all post",
      error,
    });
  }
};
module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
};
