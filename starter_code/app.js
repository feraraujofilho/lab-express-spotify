require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:

app.get("/", (req, res) => {
  console.log(req);
  res.render("index.hbs");
});

app.get("/artists", (req, res) => {
  // const artistSearchOutput =
  spotifyApi
    .searchArtists(req.query.search)

    .then(data => {
      console.log("The received data from the API: ", data.body.artists.items);
      // res.send(data.body.artists.items);

      res.render("artists.hbs", {
        artistInfo: data.body.artists.items
      });
    })
    // const albumInfo = spotifyApi.getArtistAlbums(artistSearchOutput);
    // res.send(albumInfo);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'

    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  // .getArtistAlbums() code goes here

  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(function(data) {
      // console.log('Artist albums', data);
      // res.send(data);

      res.render("albums.hbs", {
        albumsInfo: data.body.items
      });
    })
    // function (err) {
    //     console.error('error  aaaaaaah', err);
    // }
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/tracks/:albumId", (req, res, next) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId, {
      limit: 5,
      offset: 1
    })
    .then(
      function(data) {
        console.log(data.body);
        res.render("tracks.hbs", {
          tracksInfo: data.body.items
        });
        // res.send(data.body);
      },
      function(err) {
        console.log("Something went wrong!", err);
      }
    );

  // res.render('tracks.hbs', {
  //     song: data.body.items
  // })

  // })
  // .catch(function (error) {
  //     console.error(error);
  // })
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
