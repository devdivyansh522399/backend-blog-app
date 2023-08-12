const { Schema, default: mongoose } = require("mongoose");
const postCategoriesSchema = new mongoose.Schema({
     name : {
        type: String,
        required:[true,'Category is required'],
     }
}, {timestamps:true});

module.exports = mongoose.model("postCategoriesModel", postCategoriesSchema);