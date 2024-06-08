const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const articleRouter = require('./routes/article');
const Article = require("./models/article");
require('dotenv').config();
const app = express();

app.set('view engine','ejs');

const username = process.env.USER;
const password = process.env.PASSWORD;

const cluster = "cluster0.gbyqoea";
const dbname = "bharat_intern_db2"; 

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


app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'))
app.get('/',async(req,res)=>{
    const article = await Article.find().sort({createdAt:'desc'})
    res.render("article/index",{article:article});
})

app.use('/article',articleRouter);

app.listen(3000);