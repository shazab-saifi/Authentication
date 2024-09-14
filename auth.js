const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "ItsShahzaib";
const app = express();

const users = [];

app.use(express.json());

// we were generating token menually here
// function generateToken() {
//     const str = "ABCDEFGHIJKLMNOPQRSTWXYZabcdefghijklmnopqrstwxyz123456789?/@#$%&!";
//     let token = '';
//     for (let i = 0; i < 32; i++) {
//         let randomIndex = Math.floor(Math.random() * str.length);
//         token += str[randomIndex];
//     }
//     return token;
// }

function authMiddleware(req, res, next) {
    const token = req.headers.authentication;
    const decodeInformation = jwt.verify(token, JWT_SECRET);
    const userName = decodeInformation.userName;
    if (userName) {
        req.userName = userName;
        next();
    }else{
        res.json({
            msg: "You are not signed in"
        })
    }
}

app.post("/signup", function(req, res) {
    const userName = req.body.userName;
    const password = req.body.password;
    
    if (users.find(user => user.userName === userName)) {
        return res.json({
            msg: "You are already sign up!"
        })
    } 
    
    users.push({
        userName,
        password
    })

    res.json({
        msg: "You are signed up successfully"
    })
    console.log(users)
})

app.post("/signin", function(req, res) {
    const userName = req.body.userName;
    const password = req.body.password;

    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].userName === userName && users[i].password === password) {
            foundUser = users[i];
        }
    }

    if (foundUser) {
        const token = jwt.sign({
            userName
        }, JWT_SECRET);
        // foundUser.token = token;
        res.json({
            token: token
        })
    }else{
        res.status(404).send({
            msg: "Invalid username or password!"
        })
    }
    console.log(users)
})

app.get("/me", authMiddleware, function(req, res) {
    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].userName === req.userName) {
            foundUser = users[i];
        }
    }

    res.json({
        userName: foundUser.userName,
        password: foundUser.password
    })
})
// app.get("/me", authMiddleware, function(req, res) {
//     const user = users.find(user => user.userName === req.userName);
//     if (user) {
//         res.send({
//             usrename: user.userName,
//             password: user.password
//         })
//     }else{
//         res.status(401).send({
//             msg: "Unauthorized"
//         })
//     }
// })

app.listen(3009);