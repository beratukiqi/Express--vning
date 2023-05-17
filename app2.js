const express = require("express");
const app = express();
const port = 8000;

const fs = require("fs");

app.use(express.json());

app.listen(port, () => {
    console.log("Server is live - port: 8000");
});

app.get("/api/message", (request, response) => {
    console.log("MESSAGE HAS BEEN FETCHED");
    response.json({ message: "HELOOO", port: port, name: "Berat" });
});

app.post("/api/register", (request, response) => {
    const data = request.body;

    response.json({
        success: true,
        username: data.username,
    });
});
