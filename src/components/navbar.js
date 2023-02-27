import { useState, useEffect } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import "@fontsource/roboto/500.css";
import Logo from "./logo";

export default function Navbar({ loggedIn, username }) {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [progressState, setProgressState] = useState(false);
    const router = useRouter();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const destroySession = () => {
        fetch("/api/logout", {
            method: "GET",
            credentials: "same-origin"
        })
            .then(() => {
                router.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        const onPageStartLoad = () => {
            setProgressState(true);
        };
        const onPageEndLoad = () => {
            setTimeout(() => {
                setProgressState(false);
            }, 1500);
        };
        router.events.on("routeChangeStart", onPageStartLoad);
        router.events.on("routeChangeComplete", onPageEndLoad);
    });

    return (
        <AppBar position="static" className="black" sx={{ width: "100%" }}>
            <Container maxWidth={false} disableGutters={true} sx={{ py: "1em" }}>
                <Toolbar>
                    <Logo width="182" height="46" margintop="5px" marginright="10px" />
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} id="navbar">
                        <div style={{ marginTop: "2px", marginBottom: "2px", color: "white", display: "block" }}>
                            <Button sx={{ my: 2, color: "white", display: "block" }}>
                                <Link href="/" className="no-text-decoration">Home</Link>
                            </Button>
                        </div>                                                                                                                                                                        
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        {loggedIn 
                            ?
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Tooltip title="Check your account">
                                    <IconButton onClick={handleOpenUserMenu} disableRipple={true} sx={{ padding: 0 }}>
                                        <Avatar src="/tapewinder_profilepicture.jpg" alt="profile picture" />
                                        <Typography sx={{ marginLeft: "8px" }}>@{username}</Typography>
                                    </IconButton>
                                </Tooltip>
                            </div>
                            :
                            <div>
                                <Tooltip title="Sign up">
                                    <Button className="mr-5" href="/signup" component="div">
                                        <Link href="/signup" className="no-text-decoration">Sign up</Link>
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Log in">
                                    <Button variant="contained" component="div">
                                        <Link href="/login" className="no-text-decoration">Log in</Link>
                                    </Button>
                                </Tooltip>
                            </div>
                        }
                        <Menu
                            sx={{ mt: "45px", px: "100px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem>
                                <Typography textAlign="center">Profile</Typography>
                            </MenuItem>
                            <MenuItem>
                                <Typography textAlign="center">Settings</Typography>
                            </MenuItem>
                            <MenuItem onClick={destroySession}>
                                <Typography textAlign="center">Log out</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
            <LinearProgress className="progress-override" sx={{display: progressState ? "block": "none"}} />
        </AppBar>
    );
}
