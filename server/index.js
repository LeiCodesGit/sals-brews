import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

import connect from "./database/mongodb-connect.js";
import redirectIfNotLoggedIn from "./middlewares/redirectIfNotLoggedIn.js";
import Cart from "./models/cart.js";

// Route imports
import authRouter from "./routes/auth/routes.js";
import adminRouter from "./routes/admin/routes.js";
import productRouter from "./routes/products.js";
import cartRouter from "./routes/api/cart.js";
import homeRouter from "./routes/home.js";
import itemRouter from "./routes/api/item.js";
import orderRouter from "./routes/api/order.js";
import adminOrderRouter from "./routes/admin/orders.js";

// Environment Setup
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors({ origin: `http://localhost:${port}`, credentials: true }));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECTION,
        dbName: "sals-brews",
        collectionName: "sessions",
        ttl: 1000 * 60 * 60, // 1 hour
    }),
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
    },
}));

// Static Files
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Connect DB
connect();

// Route usage
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/itempage", itemRouter);
app.use("/home", homeRouter);
app.use("/users", cartRouter);
app.use("/users", orderRouter); 
app.use("/admin", adminOrderRouter);

// EJS Render Routes
app.get("/", (req, res) => res.render("users/home"));
app.get("/menu", (req, res) => res.render("users/menu"));
app.get("/profile", (req, res) => res.render("users/profile"));
app.get("/itempage", (req, res) => res.render("users/itempage"));

app.get("/cart", redirectIfNotLoggedIn, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user_id: req.session.user.id }).populate("items.productId");
        res.render("users/cart", { cart: cart || { items: [] } });
    } catch (err) {
        console.error("Error loading cart:", err.message);
        res.status(500).send("Failed to load cart.");
    }
});



// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Login at http://localhost:${port}/auth/login`);
});
