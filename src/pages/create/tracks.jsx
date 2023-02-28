import Navbar from "../../components/navbar";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { useState } from "react";
import { Avatar, Container, Typography, TextField, Button, Grid, Paper, List, Autocomplete, CircularProgress, InputAdornment, ListItemText, ListItem, ListItemAvatar } from "@mui/material";


export default function Index({ isUserLoggedIn, username }) {
    const router = useRouter();
    const [songsFound, setSongsFound] = useState([]);
    const [loading, setLoading] = useState(false);
    const [titles, setTitles] = useState([]);
    const [avatars, setAvatars] = useState([]);
    const [lengths, setLengths] = useState([]);
    const [artists, setArtists] = useState([]);
    const [sideALength, setSideALength] = useState(0);
    const [sideBLength, setSideBLength] = useState(0);
    const [isFullA, setIsFullA] = useState(false);
    const [startRenderingFrom, setStartRenderingFrom] = useState(Infinity);
    let { length, title } = router.query;
    if (!title || !length) {
        [length, title] = [60, "Untitled"];
    }

    const secondsToPrettyMinutes = (seconds) => {
        const minutes = Math.floor(seconds/60);
        let remainderSeconds = seconds % 60;
        if (remainderSeconds < 10)
            remainderSeconds = "0" + remainderSeconds;
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

    const tracksToJSON = () => {
        const tracklist = {
            titles: [...titles],
            avatars: [...avatars],
            lengths: [...lengths],
            artists: [...artists]
        };
        return tracklist;
    };

    const buttonPressed = () => {
        const tracksJSON = tracksToJSON();
        router.push({
            pathname: "/create/finalize",
            query: { title: title, length: length, tracks:  JSON.stringify(tracksJSON), startRenderingFrom: startRenderingFrom }
        }, "/create/finalize");
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
                    <Grid container justifyContent="center" sx={{ pt: "30px" }}>
                        <Grid item>
                            <Typography sx={{ px: "10px"}}>Name: {title}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography sx={{ px: "10px"}}>Length: C{length}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Typography pt="2%" px="10%" overflow="hidden">Search for a song, then add it to a side of your choice using the selection boxes below.</Typography>
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
                                            value={""}
                                            options={songsFound}
                                            renderInput={(params) => <TextField {...params} label="Add songs" />}
                                            sx={{ width: "238px" }}
                                            onChange={(event, newSong) => {
                                                // if newsong is (somehow) undefined cancel add
                                                if (!newSong) {
                                                    setSongsFound([]);
                                                    return event.preventDefault();
                                                }
                                                // if we've reached the end of side b cancel add
                                                if (sideBLength + newSong.song.duration > length*30) {
                                                    return event.preventDefault();
                                                }
                                                // start rendering on side B if side a is full
                                                if (!isFullA && sideALength + newSong.song.duration > length*30) {
                                                    setIsFullA(true);
                                                    setStartRenderingFrom(titles.length);
                                                }
                                                const sideLength = isFullA ? sideBLength : sideALength;
                                                const sideToUpdate = sideLength + newSong.song.duration > length*30 || sideBLength > 0 ? setSideBLength : setSideALength;
                                                sideToUpdate(value => value + newSong.song.duration);
                                                setAvatars([...avatars, newSong.song.album.cover_small]);
                                                setTitles([...titles, newSong.label]);
                                                setLengths([...lengths, newSong.song.duration]);
                                                setArtists([...artists, newSong.song.artist.name]);
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
                            <Grid container justifyContent="space-around" alignItems="flex-start">
                                <Grid item>
                                    <Typography>{secondsToPrettyMinutes(sideALength)}/{secondsToPrettyMinutes(length*60/2)}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography>{secondsToPrettyMinutes(sideBLength)}/{secondsToPrettyMinutes(length*60/2)}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="space-around" alignItems="flex-start">
                                <Grid item sx={{ mr: "20%", maxWidth: "40%", pl: "100px" }}>
                                    <List>
                                        {
                                            titles.slice(0, startRenderingFrom).map((track, index) => (
                                                <ListItem key={track}>
                                                    <ListItemAvatar>
                                                        <Avatar src={avatars[index]} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={track} secondary={`${artists[index]}, ${secondsToPrettyMinutes(lengths[index])}`} sx={{ pr: "5px" }} />
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                </Grid>
                                <Grid item sx={{ pr: "100px" }}>
                                    <List>
                                        {
                                            titles.slice(startRenderingFrom).map((track, index) => (
                                                <ListItem key={track}>
                                                    <ListItemAvatar>
                                                        <Avatar src={avatars[index+startRenderingFrom]} />
                                                    </ListItemAvatar>
                                                    <ListItemText primary={track} secondary={`${artists[index+startRenderingFrom]}, ${secondsToPrettyMinutes(lengths[index+startRenderingFrom])}`} sx={{ pr: "5px" }} />
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="center" sx={{ mb: "50px", mt: "20px" }}>
                                <Grid item>
                                    {
                                        sideBLength
                                            ?
                                            <Button variant="contained" onClick={buttonPressed}>Submit</Button>
                                            :
                                            null
                                    }
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
        const username = sessionExists ?  req.session.user.username : null;
        return {
            props: {
                isUserLoggedIn: Boolean(req.session.user),
                username: username
            }
        };
    }, sessionOptions
);
