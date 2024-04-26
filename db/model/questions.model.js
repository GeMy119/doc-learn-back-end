import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        Question: {
            type: String,
        },
        options: {
            type: Array,
        },
        Answer: {
            type: String,
        }
    }
);

const questionModel = mongoose.model("questions", questionSchema);

export default questionModel;