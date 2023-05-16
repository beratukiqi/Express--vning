const express = require("express");
const fs = require("fs");
const app = express();
const port = 8000;
const userData = require("./users.json");

app.use(express.json());

// Starta port 8000
app.listen(port, () => {
    console.log("Port 8000 online");
});

// Skriver ut alla användare
app.get("/users", (request, response) => {
    response.json({ success: true, results: userData.users });
});

// Hanterar login
app.post("/api/login", (request, response) => {
    const currentUser = request.body;

    const loginMatch = checkUserLogin(currentUser);

    if (loginMatch) {
        response.json({ success: true });
    } else {
        response.json({ success: false });
    }
});

// Lägger till ny användare
app.post("/api/signup", (request, response) => {
    const currentUser = request.body;
    const data = getData();

    let { matchedEmail, matchedUsername } = checkEmailAndUsername(currentUser);

    if (!matchedEmail && !matchedUsername) {
        data.users.push(currentUser);
        fs.writeFileSync("./users.json", JSON.stringify(data));
    }

    response.json({
        success: true,
        usernameExists: matchedUsername,
        emailExists: matchedEmail,
    });
});

// Tar bort användare
app.delete("/api/delete/:username", (request, respons) => {
    const data = getData();
    const username = request.params.username;
    const index = data.users.findIndex((user) => user.username == username);
    data.users.splice(index, 1);

    fs.writeFileSync("./users.json", JSON.stringify(data));

    respons.json({ success: true, message: `Deleted user: ${username}` });
});

function checkEmailAndUsername(currUser) {
    let data = fs.readFileSync("./users.json");
    data = JSON.parse(data);
    let usersList = data.users;
    let matchedEmail = false;
    let matchedUsername = false;

    usersList.forEach((user) => {
        if (Object.is(user.email, currUser.email)) {
            matchedEmail = true;
        }
        if (Object.is(user.username, currUser.username)) {
            matchedUsername = true;
        }
    });

    return { matchedEmail, matchedUsername };
}

function checkUserLogin(currUser) {
    let hasMatched = false;

    let data = getData(); // Hämta användare

    data.users.forEach((user) => {
        if (
            Object.is(
                user.username + user.password,
                currUser.username + currUser.password
            )
        ) {
            hasMatched = true;
        }
    });

    return hasMatched;
}

function getData() {
    let data = JSON.parse(fs.readFileSync("./users.json"));
    return data;
}
