import express from "express";
import UserController from "../controllers/user_controller.mjs";
import { isAuthenticated } from "../middlewares/auth.mjs";

const userRouter = express.Router();

userRouter.get("/", isAuthenticated, (req, res) => {
  UserController.index(req, res, { user: req.session.user });
});
userRouter.get("/new", isAuthenticated, (req, res) => {
  UserController.new(req, res, { user: req.session.user });
});
userRouter.post("/create", isAuthenticated, (req, res) => {
  UserController.create(req, res, { user: req.session.user });
});
userRouter.delete("/delete/:id", isAuthenticated, (req, res) => {
  UserController.delete(req, res, { user: req.session.user });
});

export default userRouter;
