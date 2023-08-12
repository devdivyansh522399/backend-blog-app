const postModel = require("../models/postModel");
const cloudinary = require('cloudinary').v2;
const v4 = require('uuid')
const uuidv4 = v4.v4;
//REGISTER API

cloudinary.config({
  cloud_name: process.env.CLOUDINRY_CLOUD_NAME,
  api_key: process.env.CLOUDINRY_API_KEY,
  api_secret: process.env.CLOUD_NAME,
})


const createPost = async (req, res, next) => {
    try {
      const post = new postModel({
        title: "sample title",
        caption: "sample caption",
        slug: uuidv4(),
        body: {
          type: "doc",
          content: [],
        },
        photo: "",
        user: req.user._id,
      });
  
      const createdPost = await post.save();
      return res.json(createdPost);
    } catch (error) {
      next(error);
    }
  };


//LOGIN API


module.exports = {
    createPost,
};
