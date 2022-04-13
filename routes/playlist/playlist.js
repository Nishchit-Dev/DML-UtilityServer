const express = require('express');
const { runOnChangeOnly } = require('nodemon/lib/config/defaults');
const router = express.Router();
const controller = require('../../controllers/playlistController');

router.post('/AddSearch',controller.AddTrackForSearch);

router.post('/newlyadded',controller.NewlyAdded);
router.post('/createPlaylist',controller.CreatePlaylist)

router.post('/Add',controller.AddTrack);
router.post('/Remove',controller.RemoveTrackFromPlaylist);

router.post('/fetchPlaylist',controller.fetchPlaylist)
module.exports = router