const express = require('express');
const path = require('path');
const routes = require('./routes/users.js');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();
const PORT = 5000;

// 1. Parse JSON request bodies - MUST BE FIRST
app.use(express.json());

// 2. Initialize session middleware with options
app.use(session({ secret: "fingerprint", resave: true, saveUninitialized: true }));

// 3. Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// 4. Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Friends API with Authentication!');
});

// 5. Login endpoint - BEFORE authentication middleware
app.post("/login", (req, res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(404).json({ message: "Body Empty" });
    }
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: user
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token in session
    req.session.authorization = {
        accessToken
    }
    return res.status(200).send("User successfully logged in");
});

// 6. Middleware for user authentication - ONLY for /user routes
app.use("/user", (req, res, next) => {
    // Check if user is authenticated
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token

        // Verify JWT token for user authentication
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Set authenticated user data on the request object
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" }); // Return error if token verification fails
            }
        });
    } else {
        // Return error if no access token is found in the session
        return res.status(403).json({ message: "User not logged in" });
    }
});

// 7. User routes - AFTER authentication middleware
app.use("/user", routes);

// Start server
app.listen(PORT, () => console.log("Server is running at port " + PORT));
