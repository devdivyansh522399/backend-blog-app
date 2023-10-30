const { Schema, default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: [true, "Caption is required"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
    },
    body: {
      type: Object,
      required: [true, "Body is required"],
    },
    photo: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    tags: {
      type: [String],
    },
    
    Categories: [{ type: Schema.Types.ObjectId, ref: "postCategoriesModel" }],
    upvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true , toJSON : {virtuals : true}}
);

postSchema.virtual("comments", { 
    ref: "commentModel",
    localField : "_id",
    foreignField:"post",
});
const postModel =  mongoose.model("postModel", postSchema);
module.exports = postModel;