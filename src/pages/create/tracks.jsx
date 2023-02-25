import Navbar from "../../components/navbar";
import { withIronSessionSsr } from "iron-session/next";
import { useState, useEffect } from "react";
import { Avatar, Container, Typography, TextField, Button, Grid, Paper, List, Autocomplete, CircularProgress, InputAdornment, ListItemText, ListItem, ListItemAvatar } from "@mui/material";

export default function Index({ isUserLoggedIn, username }) {
    const [songsFound, setSongsFound] = useState([]);
    const [loading, setLoading] = useState(false);
    const [titles, setTitles] = useState([]);
    const [avatars, setAvatars] = useState([]);
    const [lengths, setLengths] = useState([]);
    const [artists, setArtists] = useState([]);
    const [textField, setTextField] = useState(null);

    useEffect(() => {
        console.log("useeffect", titles, avatars, lengths, artists);
    });

    const secondsToPrettyMinutes = (seconds) => {
        const minutes = Math.floor(seconds/60);
        const remainderSeconds = seconds % 60;
        return `${minutes}:${remainderSeconds}`;
    };

    const songsToComboBox = (event) => {
        setLoading(true);
        const field = event.target[0].value;
        if (!field)
            return event.preventDefault();
        fetch(`/api/search/?q=${field}`, {
            method: "GET",
            cache: "no-cache",
            credentials: "omit"
        })
            .then((res) => res.json())
            .then((res) => {
                const songs = res.content.data;
                const formattedSongs = songs.map((song) => {
                    return { label: song.title, song: song };
                });
                setSongsFound(formattedSongs);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
            });
        return event.preventDefault();
    };

    const clearSearch = () => {
        setSongsFound([]);
    };

    return (
        <>
            <Navbar loggedIn={isUserLoggedIn} username={username} />
            <Container maxWidth="x1" sx={{ display: "block", ml: "auto" }}>
                <Typography component="div" variant="h2" sx={{ fontWeight: "bold", pt: "2rem", textAlign: "center" }}>Create a mixtape:</Typography>
                <Typography component="div" variant="body2" sx={{ py: "10px", pb: "40px", textAlign: "center" }}>Share a curated list of songs with your friends or other people across the world.</Typography>
            </Container>
            <Container sx={{ width: "90%" }}>
                <Paper elevation={1}>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Typography pt="10%" px="10%" overflow="hidden">Search for a song, then add it to a side of your choice using the selection boxes below.</Typography>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center" alignItems="center">
                        <Grid item xs={12}> 
                            <form onSubmit={songsToComboBox}>
                                <Grid container justifyContent="center" alignItems="center" px={"10px"}>
                                    <Grid item sx={{ pt: "5%" }}>
                                        <TextField 
                                            name="query" 
                                            variant="outlined" 
                                            label="Search"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        {loading ? <CircularProgress size={20} color="inherit" /> : null}
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="center" pt="15px">
                                    <Grid item>
                                        <Autocomplete 
                                            value={textField}
                                            options={songsFound}
                                            renderInput={(params) => <TextField {...params} label="Add songs to side A" />}
                                            sx={{ width: "200px"}}
                                            onChange={(event, newSong) => {
                                                if (!newSong) {
                                                    setSongsFound([]);
                                                    return event.preventDefault();
                                                }
                                                setAvatars([...avatars, newSong.song.album.cover_small]);
                                                setTitles([...titles, newSong.label]);
                                                setLengths([...lengths, newSong.song.duration]);
                                                setArtists([...artists, newSong.song.artist.name]);
                                                setTextField(null);
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ pt: "20px" }}>
                                    <Grid item>
                                        <Button variant="contained" type="submit">Search</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="text" onClick={clearSearch}>Clear</Button>
                                    </Grid>
                                </Grid>
                            </form>
                            
                            <Grid container justifyContent="space-around" alignItems="center">
                                <Grid item>
                                    <Typography>Side A</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>Side B</Typography>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="space-around" alignItems="center">
                                <Grid item sx={{ mr: "20%", maxWidth: "40%" }}>
                                    <List sx={{ pr: "200px" }}>
                                        {
                                            titles.map((track, index) => (
                                                <ListItem key={track}>
                                                    <ListItemAvatar>
                                                        <Avatar src={avatars[index]} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={track} secondary={`${artists[index]}, ${secondsToPrettyMinutes(lengths[index])}`} />
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                </Grid>
                                <Grid item>
                                    <List>
                                    </List>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
}

const sessionOptions = {
    cookieName: "tapewinder_user",
    password: process.env.REACT_APP_PRIVATE_KEY,
    cookieOptions: {
        secure: process.env.NODE_ENV === "production"
    }
};

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        const sessionExists = typeof req.session.user !== "undefined";
        const user = sessionExists ? req.session.user : null;
        const username = sessionExists ?  req.session.user.username : null;
        return {
            props: {
                user: user,
                isUserLoggedIn: Boolean(req.session.user),
                username: username
            }
        };
    }, sessionOptions
);