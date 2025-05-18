import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  }, 
  {
    timestamps: true,
  }
);

const Todo = mongoose.model("Todo", TodoSchema);