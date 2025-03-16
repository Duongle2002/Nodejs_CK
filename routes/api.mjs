import express from "express";
import jwt from "jsonwebtoken";
import ApiUserController from "../controllers/api_user_controller.mjs";

const apiuserRouter = express.Router();

apiuserRouter.get("/users", (req, res) => {
  ApiUserController.index(req, res, { user: req.session.user });
});
apiuserRouter.get("/users/:id", (req, res) => {
  ApiUserController.show(req, res, { user: req.session.user });
});
apiuserRouter.delete("/users/:id", (req, res) => {
  ApiUserController.destroy(req, res, { user: req.session.user });
});
apiuserRouter.post("/users", (req, res) => {
  ApiUserController.create(req, res, { user: req.session.user });
});
apiuserRouter.post("/login", (req, res) => {
  ApiUserController.login(req, res, { user: req.session.user });
});

export default apiuserRouter;
