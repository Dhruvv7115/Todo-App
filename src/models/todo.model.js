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
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  }, 
  {
    timestamps: true,
  }
);

export const Todo = mongoose.model("Todo", todoSchema);