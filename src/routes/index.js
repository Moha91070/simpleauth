import { Router } from 'express';
import { cleanData, validate, checkEmail } from '../utils';
const User = require('../models/User')
import CryptoJS from "crypto-js";
const AccessControl = require('accesscontrol');

const router = Router();

router.get("/", function (req, res) {
    res.render('index');
});

router.get("/register", function (req, res) {
    res.render('register');
});

router.post('/register', async function (req, res) {
    let data = req.body;
    let newData = cleanData(data);
    console.log(newData)
    if (!validate(newData) || !checkEmail(newData.email)) {
        res.send("donnée(s) incorrecte(s)");
    }
    else {
        //persist user in database
        try {
            let { username, email, password } = newData
            password = CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();
            const user = await User.create({ username, email, password })
            res.status(201).render('login');
        }
        //if error then send error 
        catch (err) {
            //const errors = signUpErrors(err)
            res.status(200).send(err)
        }
    }
});

//Showing login form
router.get("/login", function (req, res) {
    res.render('login');
});

router.post('/login', async function (req, res) {
    //1- get data 
    console.log(req.body);
    //2- authenticate user 
    try {
        const user = await User.findOne({ username: req.body.username });
        console.log(user);
        if (!user) {
            res.status(401).json("Utilisateur inconnu !!!");
        }
        else {

            const originalPassword = CryptoJS.AES.decrypt(
                user.password,
                process.env.PASS_SEC
            ).toString(CryptoJS.enc.Utf8);

            originalPassword !== req.body.password ? res.status(401).send({ message: "Le mot de passe ne correspond pas." }) : res.render('home');
        }

    } catch (e) {
        res.status(500).json(e);
    }

    //3- if success redirect to home page 

});

router.get("/allusers", function (req, res) {
    res.render('usersResult');
});





export default router;

