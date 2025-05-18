import { Router } from "express";
const router = Router();

// add a todo
router.post("/todo/add",(req, res) => {
  res.send("add todo route hit")
})

// delete a todo
router.delete("/todo/delete",(req, res) => {
  res.send("delete todo route hit")
})

export default router;