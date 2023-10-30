const { Schema, default: mongoose } = require("mongoose");

const commentSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "users",
        required: true
    },
    desc : {
        type : String,
        trim :true,
        maxlength : 250,
        minlength : [1,"Comment should be atleast one character long"],
        required:[true,'Please add a description']
    },

    post : {
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
        ref :"users",
        default :null
    },
    vote : {
        type : Number,
        default : 0
    }
}, {timestamps:true ,toJSON : {virtuals : true}});

commentSchema.virtual("replies", { 
    ref: "commentModel",
    localField : "_id",
    foreignField: "parent",
});
const commentModel = mongoose.model("commentModel", commentSchema);
module.exports = commentModel;