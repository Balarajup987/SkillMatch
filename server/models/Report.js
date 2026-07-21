import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({

    reporter:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    reportedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    reason:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    status:{
        type:String,
        enum:[
            "pending",
            "approved",
            "rejected"
        ],
        default:"pending"
    }

},{
    timestamps:true
});

export default mongoose.model(
    "Report",
    reportSchema
);