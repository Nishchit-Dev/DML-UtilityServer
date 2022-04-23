const model = require("../model/playlistModel");
const joi = require("joi");
const { default: mongoose } = require("mongoose");
const auth = require("../helper/jwt.js");
const jwtObj = require("../helper/jwt.js");

const schema_model = joi.object({
  title: joi.string().required(),
  wallet: joi.string().required(),
});

// ! Whenn the data is entered first time to the database

// ^ structure of the each tuple

/*
    ^{
&        wallet:'0xe7B5fA2DEF3227E76b3162276CEFEc5a0d13107b'
&        playlists:[]
    ^}
*/

const NewlyAddedSchema = joi.object({
  wallet: joi.string().required(),
});
const ValidateNewlysInput = (_args) => {
  return NewlyAddedSchema.validate(_args);
};
const NewlyAdded = async (wallet) => {
  return await model.playlist.db.collection("playlist").updateOne(
    {
      Wallet: wallet,
    },
    {
      $setOnInsert: { Wallet: wallet, Playlists: [] },
    },
    {
      upsert: true,
    }
  );
};
exports.CreateUserStructure = async (req, res) => {
  var walletAd = req.body.wallet;

  try {
    var token = auth.generateToken({ walletAd });

    var validation = ValidateNewlysInput(req.body);

    if (validation.error) {
      console.log(validation.error.details[0].message);
    } else {
      NewlyAdded(walletAd).then((response) => {
        console.log(response);
        response.acknowledged === true
          ? res.send(JSON.stringify({ acknowledged: true, authToken: token }))
          : res.send(JSON.stringify({ acknowledged: false }));
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// ! When the walletAddress already exist and user want to create new playlist

/*
    ^{
&        wallet:'0xe7B5fA2DEF3227E76b3162276CEFEc5a0d13107b'
&        playlists:[
                ^{
            ~        ListTitle:'NewMix'
            ~        playlist:[
            ~               ....
            ~               ....
            ~                ]
                ^}
&               ]
    ^}
*/

const CreatePlaylistSchema = joi.object({
  wallet: joi.string().required(),
  playlistTitle: joi.string().required(),
});

const ValidateCreatePlaylistsInput = (_args) => {
  return CreatePlaylistSchema.validate(_args);
};

const CreateNewPlaylist = async (walletAd, listTitle) => {
  // await model.playlist.db.collection("playlist").updateOne({TrackTitle:req.body.title},{$push:{'playlists':req.body.title}})
  var x = mongoose.Types.ObjectId();
  return await model.playlist.db
    .collection("playlist")
    .updateOne(
      { Wallet: walletAd },
      { $push: { Playlists: { id: x, ListTitle: listTitle, List: [] } } }
    );
};

exports.CreatePlaylist = async (req, res) => {
  var auth = jwtObj.verifyToken(req.headers.token, req.body.wallet);

  if (auth){
    var walletAd = req.body.wallet;
    var listName = req.body.playlistTitle;

    var validation = ValidateCreatePlaylistsInput(req.body);

    if (validation.error) {
      console.log(validation.error.details[0].message);
    } else {
      CreateNewPlaylist(walletAd, listName).then((response) => {
        response.modifiedCount === 0
          ? res.send(JSON.stringify({ transaction: false }))
          : res.send(JSON.stringify({ acknowledged: true }));
      });
      console.log("new Playlist is created");
    }
  } else {
    console.log("token err");
  }
};

// ! When we need to Add songs to the specified wallet and existing playlist

//  !     Note: Playlist and wallet address should exist in order to do this operation

/*
    ^{
&        wallet:'0xe7B5fA2DEF3227E76b3162276CEFEc5a0d13107b'
&        playlists:[
                ^{
            ~        ListTitle:'NewMix'
            ~        playlist:[
            ~               0:'song1',
            ~               1:'song2'
            ~                ]
                ^}
&               ]
    ^}
*/
const RemoveTrackScheme = joi.object({
  wallet: joi.string().required(),
  id: joi.number().required(),
  PlaylistID: joi.string().required(),
});

const RemoveValidation = (_args) => {
  return RemoveTrackScheme.validate(_args);
};

const RemoveTrack = async (wallet, PlayListID, TrackId) => {
  var _id = mongoose.Types.ObjectId(PlayListID);
  console.log(_id)
  return await model.playlist.db.collection("playlist").updateOne(
    { Wallet: wallet, "Playlists.id" : _id },
    {
      $pull: { "Playlists.$.List": { id: TrackId } },
    }
  );
};

exports.RemoveTrackFromPlaylist = (req, res) => {
  var auth = jwtObj.verifyToken(req.headers.token, req.body.wallet);

  if (auth) {
    var walletAd = req.body.wallet;
    var trackid = req.body.id;
    var tracklist = req.body.PlaylistID;

    console.log(req.body);
    var validation = RemoveValidation(req.body);

    if (validation.error) {
      console.log(validation.error.details[0].message);
    } else {
      RemoveTrack(walletAd, tracklist, trackid).then((resp) => {
        console.log(resp);
        res.send(resp);
      });
    }
  } else {
    console.log("token err");
  }
};

const ValdiationModel = joi.object({
  wallet: joi.string().required(),
  PlaylistID: joi.string().required(),
  Track: joi.object().required(),
});
const ValidationOfTrack = (obj) => {
  return ValdiationModel.validate(obj);
};

const AddTracks = async (wallet, PlayListID, Track) => {
  var _id = mongoose.Types.ObjectId(PlayListID);
  console.log(Track);
  return await model.playlist.db
    .collection("playlist")
    .updateOne(
      { Wallet: wallet, "Playlists.id": _id },
      { $push: { "Playlists.$.List": Track } }
    );
};
exports.AddTrack = (req, res) => {
  var auth = jwtObj.verifyToken(req.headers.token, req.body.wallet);

  if (auth) {
    var validation = ValidationOfTrack(req.body);

    var walletAdd = req.body.wallet;
    var listname = req.body.PlaylistID;
    var track = req.body.Track;

    if (validation.error) {
      console.log(validation.error.details[0].message);
    } else {
      AddTracks(walletAdd, listname, track).then((resp) => {
        console.log(resp);
        res.send(resp);
      });
     
    }
  } else {
    console.log("token err");
  }
};

const fetchPlaylist = joi.object({
  wallet: joi.string().required(),
});
const ValidateFetchPlaylist = (_args) => {
  return fetchPlaylist.validate(_args);
};

const FetchPlaylists = async (wallet) => {
  return await model.playlist.db
    .collection("playlist")
    .findOne({ Wallet: wallet });
};
exports.fetchPlaylist = (req, res) => {
  var auth = jwtObj.verifyToken(req.headers.token, req.body.wallet);

  if (auth) {
    var walletAd = req.body.wallet;

    var validation = ValidateFetchPlaylist(req.body);

    if (validation.error) {
      console.log(validation.error.details[0].message);
    } else {
      FetchPlaylists(walletAd).then((response) => {
        console.log(JSON.stringify(response));
        res.send(response);
      });
    }
  } else {
    console.log("token err");
  }

  console.log("fetching the playlist of user");
};

const TrackSchema = joi.object({
  track: joi.string().required(),
  wallet:joi.string().required()
});

const TrackValidation = (track) => {
  return TrackSchema.validate(track);
};

const AddForSearch = async (track) => {
  return await model.playlist.db
    .collection("TrackSearch")
    .insertOne({ Track: track });
};

exports.AddTrackForSearch = async (req, res) => {
  var auth = jwtObj.verifyToken(req.headers.token, req.body.wallet);

  if (auth) {
    var TrackName = req.body.wallet;

    var valid = TrackValidation(req.body);

    if (valid.error) {
      console.log(valid.error.details[0].message);
    } else {
      AddForSearch(req.body.track).then((response) => {
        console.log(response);
        res.send(response);
      });
    }
  }
};
