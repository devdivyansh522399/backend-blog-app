const JWT = require("jsonwebtoken");

const userModel = require("../models/userModel");

const { hashPassword, comparePassword } = require("../utils/authhelper");
const { uploadPicture } = require("../middlewares/uploadPicture");
const { fileRemover } = require("../utils/fileRemover");


//REGISTER API

// cloudinary.config({
//   cloud_name: process.env.CLOUDINRY_CLOUD_NAME,
//   api_key: process.env.CLOUDINRY_API_KEY,
//   api_secret: process.env.CLOUD_NAME,
// })


const registerController = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, answer } = req.body;
    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }
    let hashedPassword = await hashPassword(password);
    // creating a new user
    user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      answer,
    });

    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(201).json({
      success: true,
      message: "User registered",
      user,
      token
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong in register",
      error,
    });
  }
};


//LOGIN API

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user

    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    user = await userModel.findById(user._id).select("-password");
    res.status(200).send({
      success: true,
      message: "login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};


//PROFILE API

const userProfile = async (req, res) => {
  const userId = req.params.userId;
  try {
    let user = await userModel.findById(userId);
    user = await userModel.findById(user._id).select("-email");
    if (user) {
      return res.status(200).send({
        success: true,
        message: "user Find succussfully",
        user,
      });
    }

    return res.status(404).send({
      success: false,
      message: "User is not registerd",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting profile",
      error,
    });
  }
};

//UPDATE PROFILE

const updateProfile = async (req, res) => {
  const userId = req.params.userId;
  try {
    let user = await userModel.findById(userId);

    if (!user) {
      res.status(400).send({
        success: false,
        message: "User not found",
        error,
      });
    }

    user.name = req.body.name || user.name;
    if(req.body.password){
      let hashedPassword = await hashPassword(req.body.password)
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();
    user = await userModel.findById(updatedUser._id).select("-password");
    return res.status(201).json({
      success: true,
      message: "Profile updated successfully!",
      user : updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in getting profile",
      error,
    });
  }
};

// UPDATE PROFILE PICTURE

const updateProfilePicture = async (req, res) => {
  try{
    const upload = uploadPicture.single("profilePicture");
    const userId = req.params.userId;
    upload(req, res, async function (err) {
      if (err) {
        console.log(err.message);
        res.status(400).send({
          success: false,
          message: "Error in updating profile picture",
          err,
        });
      } else {
        // every thing went well
        if (req.file) {
          let filename;
          let updatedUser = await userModel.findById(userId);
          filename = updatedUser.avatar;
          if (filename) {
            fileRemover(filename);
          }
          updatedUser.avatar = req.file.filename;
          await updatedUser.save();
          res.json({
              success : true,
              message :  "Profile updated..",
              user : updatedUser
          });
        } else {
          let filename;
          let updatedUser = await userModel.findById(req.user._id);
          filename = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();
          fileRemover(filename);
          res.json({
            success : true,
            message :  "Profile updated..",
            user : updatedUser
        });
        }
      }
    });
  }
  catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in updating profile picture",
      error,
    });
  }
};

// method two


module.exports = {
  registerController,
  loginController,
  userProfile,
  updateProfile,
  updateProfilePicture,
};
