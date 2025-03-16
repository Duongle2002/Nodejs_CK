import express from "express";
import AdminController from "../controllers/adminController.mjs";
import { isAuthenticated } from "../middlewares/auth.mjs";
import { isAdmin } from "../middlewares/isAdmin.mjs";

const router = express.Router();

router.get("/users", isAuthenticated, isAdmin, (req, res) => {
  AdminController.manageUsers(req, res, { user: req.session.user });
});
router.get("/users/new", isAuthenticated, isAdmin, (req, res) => {
  AdminController.newUser(req, res, { user: req.session.user });
});
router.post("/users/create", isAuthenticated, isAdmin, (req, res) => {
  AdminController.createUser(req, res, { user: req.session.user });
});
router.post("/users/delete/:id", isAuthenticated, isAdmin, (req, res) => {
  AdminController.deleteUser(req, res, { user: req.session.user });
});

// Routes quản lý products
router.get("/products", isAuthenticated, isAdmin, (req, res) => {
  AdminController.manageProducts(req, res, { user: req.session.user });
});
router.get("/products/new", isAuthenticated, isAdmin, (req, res) => {
  AdminController.newProduct(req, res, { user: req.session.user });
});
router.post("/products/create", isAuthenticated, isAdmin, (req, res) => {
  AdminController.createProduct(req, res, { user: req.session.user });
});
router.post("/products/delete/:id", isAuthenticated, isAdmin, (req, res) => {
  AdminController.deleteProduct(req, res, { user: req.session.user });
});

export default router;
