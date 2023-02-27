import Navbar from "../../components/navbar";
import { withIronSessionSsr } from "iron-session/next";
import { Grid, Paper, Container, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import SongList from "../../components/songlist";
import "@fontsource/roboto";

export default function Finalize({ isUserLoggedIn, username }) {
    const router = useRouter();
    const [redirect, setRedirect] = useState(false);
    const { length, title, startRenderingFrom } = router.query;
    const tracks = JSON.parse(router.query.tracks);
    tracks.title = title;
    tracks.length = length;
    console.log(length, title, tracks, startRenderingFrom);

    const postTracks = async () => {
        const res = await fetch("/api/addmixtape", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tracks)
        });
        if (res.status === 201 || res.status === 200) {
            setRedirect(true);
        }
    };

    useEffect(() => {
        if (redirect) {
            router.push("/");
        }
    });

    return (
        <>
            <Navbar loggedIn={isUserLoggedIn} username={username} />
            <Container sx={{ width: "80%", mt: "50px" }}>
                <Paper elevation={1}>
                    <Grid container justifyContent="center" sx={{ pt: "50px", mb: "40px" }}>
                        <Grid item>
                            <Typography variant="h2">Is this correct?</Typography>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="space-evenly" alignItems="center">
                        <Grid item>
                            <Typography variant="h3">Title: {title}</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h3">Length: C{length}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="space-around" sx={{ mt: "30px" }}>
                        <Grid item>
                            <Typography variant="h6" sx={{ pl: "65px"}}>Side A</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" sx={{ pr: "65px" }}>Side B</Typography>
                        </Grid>
                    </Grid>
                    <SongList tracks={tracks} startRenderingFrom={startRenderingFrom} />
                    <Grid container justifyContent="center" sx={{ pb: "25px" }}>
                        <Grid item sx={{ pr: "10px"}}>
                            <Button variant="contained" onClick={postTracks}>Yes</Button>
                        </Grid>
                        <Grid item sx={{ pl: "10px"}}>
                            <Button variant="text">No</Button>
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