import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type:String,
        require:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog"
    },
    likes:[{
        types:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
},{timestamps:true});


export const Comment = mongoose.model("Comment",commentSchema);