import express from "express";
import rootRouter from "./routes/root.mjs";
import bodyParser from "body-parser";
import cors from 'cors';
import session from "express-session";
import flash from 'connect-flash';
import { productDBConnection, userDBConnection } from "./config/connectDB.mjs";
import AdminController from "./controllers/adminController.mjs";
import { isAdmin } from "./middlewares/isAdmin.mjs";
import { isAuthenticated } from "./middlewares/auth.mjs"; // Import middleware isAuthenticated
import aboutRouter from './routes/aboutRoutes.mjs';
import apiuserRouter from "./routes/api.mjs";
import blogRouter from './routes/blogRoutes.mjs';
import cartRouter from './routes/cartRoutes.mjs';
import checkOutRouter from './routes/checkOutRoutes.mjs';
import contactRouter from './routes/contactRoutes.mjs';
import productRouter from './routes/productRoutes.mjs';
import singleProductRouter from './routes/singleProductRoutes.mjs';

const app = express();
const port = 3002;

app.use(cors());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối tới cơ sở dữ liệu
userDBConnection.on("connected", () => {
  console.log("Successfully connected to users database.");
});

productDBConnection.on("connected", () => {
  console.log("Successfully connected to productDB.");
});

// Cấu hình middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cấu hình view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Định nghĩa các route
app.use("/", rootRouter);
app.use("/api/v1", apiuserRouter);
app.use('/', aboutRouter);
app.use('/', productRouter);
app.use('/', singleProductRouter);
app.use('/', cartRouter);
app.use('/', checkOutRouter);
app.use('/', blogRouter);
app.use('/', contactRouter);

// Routes for managing users
app.get("/admin/users", isAuthenticated, isAdmin, AdminController.manageUsers);
app.get("/admin/users/new", isAuthenticated, isAdmin, AdminController.newUser);
app.post("/admin/users", isAuthenticated, isAdmin, AdminController.createUser);
app.get("/admin/users/edit/:id", isAuthenticated, isAdmin, AdminController.editUser);
app.post("/admin/users/update/:id", isAuthenticated, isAdmin, AdminController.updateUser);
app.post("/admin/users/delete/:id", isAuthenticated, isAdmin, AdminController.deleteUser);

// Routes for managing products
app.get("/admin/products", isAuthenticated, isAdmin, AdminController.manageProducts);
app.get("/admin/products/new", isAuthenticated, isAdmin, AdminController.newProduct);
app.post("/admin/products/create", isAuthenticated, isAdmin, AdminController.createProduct);
app.get("/admin/products/edit/:id", isAuthenticated, isAdmin, AdminController.editProduct);
app.post("/admin/products/update/:id", isAuthenticated, isAdmin, AdminController.updateProduct);
app.post("/admin/products/delete/:id", isAuthenticated, isAdmin, AdminController.deleteProduct);

app.post('/place-order', (req, res) => {
  const { firstname, lastname, phone, email } = req.body;

  if (!firstname || !lastname || !phone || !email) {
    return res.status(400).json({ message: 'Tất cả các trường đều bắt buộc. Vui lòng điền đầy đủ thông tin.' });
  }

  console.log(`Đơn hàng được đặt bởi ${firstname} ${lastname}. Liên hệ: ${phone}, ${email}.`);
  res.status(200).json({ message: 'Đơn hàng đã được đặt thành công!' });
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});


