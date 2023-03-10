import Navbar from "../../components/navbar";
import { withIronSessionSsr } from "iron-session/next";
import { useState } from "react";
import { FormControl, RadioGroup, Paper, Alert, Grid, Button, TextField, Typography, Container, FormLabel, FormControlLabel, Radio } from "@mui/material";
import { useRouter } from "next/router";
import "@fontsource/roboto";

export default function Index({ isUserLoggedIn, username }) {
    const [title, setTitle] = useState("Untitled");
    const [length, setLength] = useState(60);
    const [alert, setAlert] = useState(null);
    const router = useRouter();

    const buttonPressed = async () => {
        const res = await fetch(`/api/duplicate?username=${username}&title=${title}`);
        const { duplicate } = await res.json();
        if (!duplicate) {
            setAlert(null);
            router.push({
                pathname: "/create/tracks",
                query: { title: title, length: length }
            }, "/create/tracks");
        } else {
            setAlert(<Alert severity="error">You already have a mixtape with this name. Please pick another.</Alert>);
        }
    };

    return (
        <>
            <Navbar loggedIn={isUserLoggedIn} username={username} />
            {alert}
            <Container maxWidth="x1" sx={{ display: "block", ml: "auto" }}>
                <Typography component="div" variant="h2" sx={{ fontWeight: "bold", pt: "2rem", textAlign: "center" }}>Select a mixtape title and length:</Typography>
            </Container>
            <Container sx={{ width: "80%" }}>
                <Paper elevation={1}>
                    <Grid container justifyContent="center" sx={{ mt: "10px", px: "20px", py: "25px" }}>
                        <Grid item>
                            <Typography>The number after C refers to the entire playtime of the mixtape. For example, a C60 has 30 minutes of playtime per side.</Typography>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center" sx={{ pb: "25px" }}>
                        <Grid item>
                            <TextField name="title" variant="outlined" label="Title" onChange={(event) => {setTitle(event.target.value);}} />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <FormControl>
                                <FormLabel id="radiolabel">Length</FormLabel>
                                <RadioGroup onChange={(event) => {setLength(event.target.value);}} aria-labelledby="radiolabel" defaultValue={60} name="radiogroup" >
                                    <FormControlLabel value={30} label="C30" control={<Radio />} />
                                    <FormControlLabel value={60} label="C60" control={<Radio />} />
                                    <FormControlLabel value={90} label="C90" control={<Radio />} />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center" sx={{ mt: "15px", pb: "25px" }}>
                        <Grid item>
                            <Button variant="contained" type="submit" onClick={buttonPressed}>Submit</Button>
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