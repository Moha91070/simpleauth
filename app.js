var express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
const User = require("./models/User");
const { create } = require("./models/User");
const { createSecureServer } = require("http2");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/TP")
  .then(() => console.log("Db Connection Successfull!"))
  .catch((e) => {
    console.log(e);
  });

var app = express();
const router = express.Router();

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

router.get("/", function (req, res) {
    res.render('index');
});

router.get("/register", function (req, res) {
    res.render('register');
});

app.post('/register', function(req, res){


    //1- get data 
    console.log(req.body);
    cleanData(req.body);    
    if (!validate(req.body) || !checkEmail(req.body.email)) {
        res.send("donnée incorrecte");
    }

    //2- add user to database 
    createUser(req, res).then(res.render('login'))
    
    //3- if success redirect to login
    

 });

//Showing login form
router.get("/login", function (req, res) {
    res.render('login');
});

app.post('/login', async function(req, res){

    //1- get data 
    console.log(req.body);
    
    //2- authenticate user 
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong Credentials !!!");
    
        const originalPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SEC
        ).toString(CryptoJS.enc.Utf8);
    
        originalPassword !== req.body.password &&
          res
            .status(401)
            .send({ message: "Le mot de passe ou l'email ne correspond pas." });
        console.log(user)
        res.render('home');
      } catch (e) {
        res.status(500).json(e);
      }
    //3- if success redirect to home page 
    

 });

app.use('/', router);

var port = process.env.PORT_SERVER || 9000;

app.listen(port, function () {
    console.log("Server Has Started! port: ", port);
});

function cleanData(data) {
        data.username.replace(/<\/?[^>]+(>|$)/g, "");
}

function validate(data) {
    var str = data.password;
    var str2 = data.passwordConfirm;
    if (str != str2) {
        return false
    }
    
    if (str.match(/[0-9]/g) &&
        str.match(/[A-Z]/g) &&
        str.match(/[a-z]/g) &&
        str.match(/[^a-zA-Z\d]/g) &&
        str.length >= 12) {
        return true;
    }
    else {
        return false 
    }
} 

function checkEmail(data) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(data.match(mailformat))
    {
     return true;
    }
    else
    {
        alert("Vous avez saisi une adresse électronique non valide !");
        return false;
    }
}

async function createUser(data, res) {
    const newUser = new User({
        username: data.username,
        email: data.email,
        password: CryptoJS.AES.encrypt(
          data.password,
          process.env.PASS_SEC
        ).toString(),
      });
      try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
      } catch (e) {
        res.status(500).json(e);
      }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong Credentials !!!");
    
        const originalPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SEC
        ).toString(CryptoJS.enc.Utf8);
    
        originalPassword !== req.body.password &&
          res
            .status(401)
            .send({ message: "Le mot de passe ou l'email ne correspond pas." });
    
        res.status(200).send(user);
      } catch (e) {
        res.status(500).json(e);
      }
}