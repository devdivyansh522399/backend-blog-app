const postModel = require("../models/postModel");
const cloudinary = require("cloudinary").v2;
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
    try {
      console.log(req.body);
      let user = await userModel.findById(req.body.userId);
      if (!user) {
        return res.status(400).send({
          success: false,
          message: "User not found",
        });
      }
      console.log("Hi from post creation");
      const result = await cloudinary.uploader.upload(req.file.path, {folder : `/Blog-App/Post/${user.name}${user._id}/`});
      const post = new postModel({
        title: req.body.title,
        caption: req.body.caption,
        slug: uuidv4(),
        photo : result.secure_url,
        body: req.body.Body,
        user: req.body.userId,
        tags : req.body.tags,
        category : req.body.category
      });
  
    const createdPost = await post.save();
    return res.json(createdPost);
  } 
  catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Creating Post",
            error,
        });
    }
  }
  

const updatePost = async (req, res) => {
  try {
    const slug = req.params?.slug || null;
    const post = await postModel.findOne({ slug: slug });
    if (!post) {
      return res.status(400).send({
        success: false,
        message: "Post not found",
        error,
      });
    }

    const postId = post._id;
    // if(req.body){
    //   console.log(req);
    //   const {title,caption,body,tags,Categories} = JSON.parse(req.body);
    //   post.title = title || post.title;
    //   post.caption = caption || post.caption;
    //   post.slug = slug || post.slug;
    //   post.body = body || post.body;
    //   post.tags = tags || post.tags;
    //   post.Categories = Categories || post.Categories;
    // }
    console.log(req.file.path);
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "/Blog-App/post",
    });
    post.photo = result.secure_url;
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
    const post = await postModel.findOneAndDelete({ slug: req.params.slug });

    if (!post) {
      return res.status(400).send({
        success: false,
        message: "Post not found",
        error,
      });
    }
    await Comment.deleteMany({ post: post._id });

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
      post : post
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
  try{
    const post = await postModel.find({}).populate([
      {
        path: "user",
        select: ["avatar", "name", "verified"],
      },
    ]).sort({createdAt:-1}).limit(50);
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
      post : post
    });
  }
  catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getting all post",
      error,
    });
  }
}
module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts
};
