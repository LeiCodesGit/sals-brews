import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import connect from "./database/mongodb-connect.js";
import  session from "express-session";
import userRouter from "./routes/users.js";
import mongoose from "mongoose";
import authRouter from "./routes/auth/routes.js";
import adminRouter from "./routes/admin.js";

// Load environment variables
dotenv.config();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connect();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials: true}));

app.use(session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

// Static file serving
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "public"))); 

//set Ejs as the templating engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));


// Connect to DB and start server
connect();
app.get("/itempage", (req, res) => {
    res.render("users/itempage");
});

// Routes


app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/admin", adminRouter);

// Default/home route
app.get("/", (req, res) => {
  res.render("users/home"); // views/home.ejs
});

app.get('/menu', (req, res) => {
    res.render('users/menu');
});

app.get('/cart', (req, res) => {
    res.render('users/cart');
});

app.get('/orderinfo', (req, res) => {
    res.render('users/orderinformation');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});




