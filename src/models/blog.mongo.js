import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
        unique:true,
        index:true
    },
    content: {
        type: String,
        required: true
    },      
    image:[{
        type:String,
        validate:{
            validator: (val) => /^https?:\/\/.+/.test(val),
            message: 'Invalid image URL.'
        }
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    tags:[{
        type:String
    }],
    publishedBy:{
        type: mongoose.Schema.ObjectId,
        ref:"User"
    }

},{timestamps:true});

blogSchema.index({ title: "text", content: "text"});
blogSchema.index({ publishedBy:1, createdAt:-1 });

blogSchema.methods.getWordCount = function(){
    return this.content.split(" ");
}

export const Blog = mongoose.model("Blog",blogSchema);