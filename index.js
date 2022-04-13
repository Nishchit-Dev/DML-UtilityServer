const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const RoutePlaylist = require("./routes/playlist/playlist");
// socket configs 
const LiveSearch = require('./socketLiveSearch/socketSearch')

dotenv.config();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/playlist", RoutePlaylist);

const uri = MongoDB_API || process.env.MongoDB_API;

const connectToDB = async () => {
  mongoose
    .connect(uri.toString())
    .then((res) => {
      // console.log(res);

      app.listen(process.env.PORT || PORT, () => {
        console.log("Server is running on port ", process.env.PORT, "........");
      });
      
    })
    .catch((err) => {
      console.log(err);
    });
};

connectToDB()
LiveSearch.listen()



