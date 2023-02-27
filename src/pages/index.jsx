import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import { withIronSessionSsr } from "iron-session/next";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Navbar from "../components/navbar";
import "@fontsource/roboto";

export default function Index({ isUserLoggedIn, username }) {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (shouldRedirect) {
            setShouldRedirect(false);
            router.push("/create/info", );
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
                    <Tooltip title="Create a new mixtape">
                        <Fab onClick={redirect} sx={{ position: "absolute", left: "92%", top: "92%" }}>
                            <AddIcon />
                        </Fab>
                    </Tooltip>
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