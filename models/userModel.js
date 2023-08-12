const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default :  ""
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Passwod is required"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: false,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    answer : {
      type : String,
      default : ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
