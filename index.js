const express = require("express");
const app = express();
const http = require('http')
const server = http.createServer(app)
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const RoutePlaylist = require("./routes/playlist/playlist");
// socket configs 
const LiveSearch = require('./socketLiveSearch/socketSearch');

dotenv.config();
app.use(function (req, res, next) {
  res.setheader("Access-Control-Allow-Origin", "*");
  res.setheader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,token');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.get('/',(req,res)=>{
  res.send("Welcome to DML-server")
})
app.use("/playlist", RoutePlaylist);

const uri =  process.env.MongoDB_API;

const connectToDB = async () => {
  mongoose
    .connect(uri.toString())
    .then((res) => {
      // console.log(res);
      server.listen(process.env.PORT,()=>{
        console.log("Server is up....")
      })
      LiveSearch.listen(server)
      // app.listen(process.env.PORT , () => {
      //   console.log("Server is running on port ", process.env.PORT, "........");
      // });
      
    })
    .catch((err) => {
      console.log(err);
    });
};

connectToDB()




