const Mongoose = require('mongoose')
const Schema = Mongoose.Schema;


const playlistModel = new Schema({
    TrackTitle:{
        type:String,
        required:true
    }
})


const playlist = Mongoose.model('playlistModel',playlistModel)

module.exports = {playlist}