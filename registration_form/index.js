var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const app = express();
var cors = require('cors');
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

const username = process.env.USER;
const password = process.env.PASSWORD;

const cluster = "cluster0.gbyqoea";
const dbname = "bharat_intern_db1"; // Replace with your actual database name

const DB = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(DB, {
    tlsAllowInvalidHostnames: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // tlsInsecure: true // Add this option to bypass SSL issues
}).then(() => {
    console.log("Connection successful");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});

// Define a schema and model for users
const userSchema = new mongoose.Schema({
    name: String,
    age: String,
    email: String,
    phno: String,
    gender: String,
    password: String
});
const User = mongoose.model('User', userSchema);

app.post("/sign_up", async (req, res) => {
    var name = req.body.name;
    var age = req.body.age;
    var email = req.body.email;
    var phno = req.body.phno;
    var gender = req.body.gender;
    var password = req.body.password;

    var data = {
        name,
        age,
        email,
        phno,
        gender,
        password
    };

    try {
        await User.create(data);
        console.log("Record inserted successfully");
        res.sendFile(path.join(__dirname, 'public', 'signup_success.html'));
    } catch (err) {
        console.error("Error inserting record:", err);
        res.sendFile(path.join(__dirname, 'public', 'signup_rejection.html'));
    }
});

app.get('/', (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
