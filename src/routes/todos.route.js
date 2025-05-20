import { Router } from "express";
import { Todo } from "../models/todo.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
const router = Router();

router.use(verifyJWT);
// add a todo
router.post("/add", async (req, res) => {
	const { content } = req.body;
	try {
		const todo = await Todo.create({
			createdBy: req.user?._id,
			content,
		});

		return res.status(200).json(new ApiResponse(200, todo, "Todo created."));
	} catch (error) {
		console.log("Error: ", error);
	}
});

// delete a todo
router.delete("/delete/:todoId", async (req, res) => {
	const { todoId } = req.params;
	try {
		//basic logic (not checking if the todo is of the user that is logged in)
		const todo = await Todo.findById(todoId);

		if (todo.createdBy.toString() !== req.user._id.toString()) {
			throw new ApiError(400, "User can only delete their own todos.");
		}

		const deletedTodo = await Todo.deleteOne({ _id: todoId });

		return res
			.status(200)
			.json(new ApiResponse(200, deletedTodo, "Todo deleted successfully."));
	} catch (error) {
		console.log("Error: ", error);
		throw new ApiError(400, "There was a problem while deleting the todo.");
	}
});

// update todo status
router.patch("/update-status/:todoId", async (req, res) => {
	const { todoId } = req.params;

	try {
		const todo = await Todo.findById(todoId);

		if (todo.createdBy.toString() !== req.user._id.toString()) {
			throw new ApiError(400, "User can only update their own todos.");
		}

		todo.isCompleted = !todo.isCompleted;

		await todo.save({ validateBeforeSave: false });

		return res
			.status(200)
			.json(new ApiResponse(200, todo, "Todo status updated successfully."));
	} catch (error) {
		console.log("Error: ", error);
	}
});

// display user todos
router.get("/display/:userId", async (req, res) => {
	const { userId } = req.params;
	try {
		if (userId !== req.user._id.toString()) {
			throw new ApiError(400, "User can only view their own todos.");
		}
		const todos = await Todo.find({ createdBy: userId })
			.populate("createdBy", "-password -refreshToken")
			.sort({ createdAt: -1 });

		const todosCount = await Todo.countDocuments({ createdBy: userId });

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					{ todos, todosCount },
					"Todos fetched successfully."
				)
			);
	} catch (error) {
		console.log("Error: ", error);
		throw new ApiError(400, "There was a problem while fetching the todos.");
	}
});

export default router;
