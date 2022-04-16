const express = require('express');
const router = express.Router();
const controller = require('../../controllers/playlistController');


// Add Search endPoint is used to add songs Everytime when Artist upload songs 
router.post('/AddSearch',controller.AddTrackForSearch);

// connect Endpoint is one which is called everytime When use Connect the wallet to the 
// React app 
router.post('/connect',controller.CreateUserStructure);

// 
router.post('/createPlaylist',controller.CreatePlaylist)

router.post('/Add',controller.AddTrack);
router.post('/Remove',controller.RemoveTrackFromPlaylist);

router.post('/fetchPlaylist',controller.fetchPlaylist)
module.exports = router
