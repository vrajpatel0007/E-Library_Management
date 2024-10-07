const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/db/dbconnect");
const Routes = require('./src/routes/route');

dotenv.config();


app.use("/public/temp", express.static(path.join(__dirname, "src", "public", "temp")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());


app.use(Routes);

const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${PORT}`);
});
