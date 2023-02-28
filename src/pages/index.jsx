import { Container, Fab, Tooltip, Typography, Grid, Card } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { withIronSessionSsr } from "iron-session/next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Navbar from "../components/navbar";
import "@fontsource/roboto";

export default function Index({ isUserLoggedIn, username }) {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const router = useRouter();

    useEffect(() => {

        if (shouldRedirect) {
            setShouldRedirect(false);
            router.push("/create/info");
        }

    }, [shouldRedirect, setShouldRedirect, router]);

    const redirect = () => {
        setShouldRedirect(true);
    };

    return (
        <>
            <Navbar loggedIn={isUserLoggedIn} username={username} />
            <Container maxWidth="x1">
                <Typography component="h1" variant="h3" sx={{ fontWeight: "bold", py: "2rem" }}>My Mixtapes:</Typography>
                {isUserLoggedIn
                    ?
                    <>
                        <Tooltip title="Create a new mixtape">
                            <Fab onClick={redirect} sx={{ position: "absolute", right: 0, bottom: 0, margin: "2.5em" }}>
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                        <Grid container justifyContent="center" alignItems="center" spacing={8}>
                            <Grid item>
                                <Card></Card>
                            </Grid>
                        </Grid>
                    </>
                    :
                    null
                }
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
        let tracks;
        fetch("/api/mixtapes", {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    tracks = response.tracks;
                } else {
                    tracks = null;
                }
            })
            .catch((err) => {
                console.error(err);
            });
        const sessionExists = typeof req.session.user !== "undefined";
        const username = sessionExists ?  req.session.user.username : null;
        return {
            props: {
                tracks: tracks,
                isUserLoggedIn: Boolean(req.session.user),
                username: username
            }
        };
    }, sessionOptions
);