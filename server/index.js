import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import connect from "./database/mongodb-connect.js";

// Load environment variables
dotenv.config();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Middleware
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth/routes.js";

app.use("/auth", authRouter);
app.use("/users", userRouter);

// Default/home route
app.get("/", (req, res) => {
  res.render("users/home"); // views/home.ejs
});

app.get('/menu', (req, res) => {
    res.render('users/menu');
});

app.get('/', (req, res) => {
    res.render('users/home');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/cart', (req, res) => {
    res.render('users/cart');
});

app.get('/orderinfo', (req, res) => {
    res.render('users/orderinformation');
});

app.get('/profile', (req, res) => {
    res.render('users/profile');
});



