import express from "express";
const dotenv = require("dotenv");
import DefaultRouter from './routes';


dotenv.config();

require('./database.js')

var app = express();
const router = express.Router();

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/../public'));
//import routes
app.use(DefaultRouter);

var port = process.env.PORT_SERVER || 9000;

app.listen(port, function () {
    console.log("Server Has Started! port: ", port);
});

