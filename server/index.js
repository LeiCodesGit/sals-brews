import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import connect from "./database/mongodb-connect.js";
import dotenv from "dotenv";
dotenv.config();

//routers:
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const port = process.env.PORT || 4000;

// Middleware to serve static files from the "public" directory
app.use(express.static("public"));
// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// enable CORS for all routes
app.use(cors());


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



app.use("/auth", authRouter);

app.get("/home", (req, res) => {
    res.render("home");
});

app.use("/users", userRouter);

connect();

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});




