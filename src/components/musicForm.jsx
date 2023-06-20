import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import axios from "axios";
import Card from "@mui/material/Card";
import { CardContent, CardActions } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import IconButton from "@mui/material/IconButton";
import { useState, useEffect } from "react";
// import env from 'dotenv';


const defaultTheme = createTheme();

const CLIENT_ID = "";
const CLIENT_SECRET = "";
let searchInput = "";

export default function MusicForm() {
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  const theme = useTheme();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let recordData = {
      record: {
        firstName: "",
        lastName: "",
        email: "",
        artist: "",
      },
    };
    recordData.record.firstName = data.get("firstName");
    recordData.record.lastName = data.get("lastName");
    recordData.record.email = data.get("email");
    recordData.record.artist = data.get("artist");

    searchInput = data.get("artist");

    // console.log(recordData);

    axios.post(`http://localhost:3000/record`, {
      "record": {
                "firstName": recordData.record.firstName,
                "lastName": recordData.record.lastName,
                "email": recordData.record.email,
                "artist": recordData.record.artist
            }

    }).then(function(response){
      console.log(response)
    }).catch(function(error){
      console.log(error)
    });
    search();
  };

  useEffect(() => {
    // API Access Token

    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  // Search
  async function search() {
    console.log("Searching for " + searchInput); //Brent
    console.log("Access token " + accessToken);

    // 1. Get request using search to get the Artist ID
    let searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    let artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    console.log("Artist ID is" + artistID);

    // 2. Get request with artist ID to grab all the albums from that artist

    let albumsReturned = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&market=US&limit=50",
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      });
    //3. Display those albums to the user
    console.log(albums);
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "success.main" }}>
            <MusicNoteIcon />
          </Avatar>
          <Typography component="h1" variant="h4">
            Provide contact info
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="firstName"
              label="First Name"
              type="firstName"
              id="firstName"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="lastName"
              label="Last Name"
              type="lastName"
              id="lastName"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="artist"
              label="Artist"
              type="artist"
              id="artist"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              // onClick={search}
            >
              Search artist
            </Button>
          </Box>
        </Box>
      </Container>

      <Container maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}
        >
          <Grid container spacing={2}>
            {albums.map((album, i) =>{
              console.log(album);
              return(
                <Card sx={{ display: "flex" }}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flex: "1 0 auto" }}>
                  <Typography component="div" variant="h5">
                    {album.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    component="div"
                  >
                  {album.artists[0].name}
                  </Typography>
                </CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
                >
                  <IconButton aria-label="previous">
                    {theme.direction === "rtl" ? (
                      <SkipNextIcon />
                    ) : (
                      <SkipPreviousIcon />
                    )}
                  </IconButton>
                  <IconButton aria-label="play/pause">
                    <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                  </IconButton>
                  <IconButton aria-label="next">
                    {theme.direction === "rtl" ? (
                      <SkipPreviousIcon />
                    ) : (
                      <SkipNextIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>
              <CardMedia
                component="img"
                sx={{ width: 151 }}
                image={album.images[0].url}
                alt="Live from space album cover"
              />
            </Card>
              )
            })}
            
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
