import express from "express";

const app = express();

// define the port
const port = 4000;

app.get("/", (req, res) => {
    res.send("Hello Todo App!!!");
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});