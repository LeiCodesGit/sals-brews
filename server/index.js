import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import connect from "./database/mongodb-connect.js";
import  session from "express-session";
import MongoStore from "connect-mongo";

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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors({origin: `http://localhost:${port}`,credentials: true}));

app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false, 
    store: MongoStore.create({ 
        mongoUrl: process.env.DB_CONNECTION, 
        dbName: "sals-brews",
        collectionName: "sessions", 
        ttl: 1000 * 60 * 60 
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60, 
        httpOnly: true,
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

import authRouter from "./routes/auth/routes.js";
import adminRouter from "./routes/admin/routes.js";
import productRouter from "./routes/products.js";
import cartRouter from "./routes/api/cart.js";
import homeRouter from "./routes/home.js"; 
import itemRouter from "./routes/api/item.js";


app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/itempage", itemRouter);
app.use("/home", homeRouter);
app.use("/api/cart", cartRouter);


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




