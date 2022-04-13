const { Server } = require("socket.io");
const joi = require("joi");
const model = require("../model/playlistModel");
const res = require("express/lib/response");
const io = new Server({});

//  will receive the search text and will query in database to find the search ones
const searchValidator = joi.object({
  searchQuery: joi.string().required(),
});

const validate = (_args) => {
  return searchValidator.validate(_args);
};

const SearchInDB = async (_args) => {

    var cursor = await model.playlist.db.collection("TrackSearch").aggregate([
      {
        $project: {
          _id: 0,
          Track: 1,
        },
      },
      {
        $match: {
          $or: [{ Track: { $regex: _args.searchQuery , $options: "-i" }}],
        },
      },
      {
        $limit: 7,
      },
    ]);
  var response = [];
  await cursor
    .forEach((doc) => {
      response.push(doc);
    })
   
  return response;
};
io.on("connect", (soc) => {
  soc.on("searchQuery", (data) => {
    if (validate(data).error) {
      soc.emit("found", "errors");
      console.log(validate(data).error.details[0].message);
    } else {
      SearchInDB(data).then((res) => {
        soc.emit("found", res);
        console.log(res)
      });
    }
  });
});

exports.listen = ()=>{
    io.listen(process.env.SocketPort || SocketPort);
}
