import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import connect from "./database/mongodb-connect.js";
import  session from "express-session";

// Load environment variables
dotenv.config();

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials: true}));

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static file serving
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use(express.static(path.join(__dirname, "public"))); 
//set Ejs as the templating engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

app.use('/assets', express.static(path.join(__dirname,'assets')));
app.use('/styles', express.static(path.join(__dirname,'styles')));
app.use('/scripts', express.static(path.join(__dirname,'scripts')));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res)=>{
    res.render('home');
});


// Routes
import authRouter from "./routes/auth/routes.js";
import adminRouter from "./routes/admin/routes.js";
import productRouter from "./routes/products.js";

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);

// Default/home route
app.get("/", (req, res) => {
  res.render("home"); // views/home.ejs
});

// Connect to DB and start server
connect();
app.get("/itempage", (req, res) => {
    res.render("itempage");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/menu', (req, res) => {
    res.render('menu');
});

app.get('/itempage', (req, res) => {
    const item = req.query.item; 
    res.render('itempage');
});

app.get('/h', (req, res) => {
    res.render('home');
});



