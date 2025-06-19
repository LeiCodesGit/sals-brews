import express from "express";
import cors from "cors";

import authRouter from "./routes/auth/routes.js";


const app = express();
const port = 4000;

// Middleware to serve static files from the "public" directory
app.use(express.static("public"));
// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// enable CORS for all routes
app.use(cors());

// Set EJS as the templating engine
app.set("view engine", "ejs");

app.use("/auth", authRouter);

app.get("/home", (req, res) => {
    res.render("home");
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});

