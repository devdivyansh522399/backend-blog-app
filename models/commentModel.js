const { Schema, default: mongoose } = require("mongoose");

const commentSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "userModel",
        required: true
    },
    desc : {
        type : String,
        trim :true,
        maxlength : 250,
        minlength : [1,"Comment should be atleast one character long"],
        required:[true,'Please add a description']
    },

    postId : {
        type : Schema.Types.ObjectId,
        ref : "postModel",
        required : true
    },
    check : {
        type : Boolean,
        default : false
    },
    parent : {
        type : Schema.Types.ObjectId,
        ref:"commentModel",
        default : null
    },

    replyOnUser : {
        type : Schema.Types.ObjectId,
        ref :"userModel",
        default :null
    },
    vote : {
        type : Number,
        default : 0
    }
}, {timestamps:true});

commentSchema.virtual("replies", { 
    ref: "commentModel",
    localField : "_id",
    foreignField: "parent",
});

module.exports = mongoose.model("commentModel", commentSchema);