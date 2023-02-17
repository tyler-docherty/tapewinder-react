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
import LinearProgress from "@mui/material/LinearProgress";
import { useRouter } from "next/router";
import "@fontsource/roboto/500.css";
import Logo from "./logo";
import UserAvatar from "./avatar";

const pages = ["Home" ,"Popular", "About"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

export default function Navbar({ loggedin }) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [progressState, setProgressState] = useState(false);
    const router = useRouter();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        const onPageStartLoad = () => {
            setProgressState(true);
        };
        const onPageEndLoad = () => {
            setTimeout(() => {
                setProgressState(false);
            }, Math.floor(Math.random()*1000)+500);
        };
        router.events.on("routeChangeStart", onPageStartLoad);
        router.events.on("routeChangeComplete", onPageEndLoad);
    });

    return (
        <AppBar position="static" className="black">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Logo width="182" height="46" margintop="5px" marginright="10px" />
                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }} id="navbar">
                        <div style={{ marginTop: "2px", marginBottom: "2px", color: "white", display: "block" }}>
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: "white", display: "block" }}>
                                <Link href="/" className="no-text-decoration">Home</Link>
                            </Button>
                        </div>                                                                                                                                                                        
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        {loggedin 
                            ?
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <UserAvatar src="tapewinder_profilepicture.jpg" alt="profile picture"/>
                                </IconButton>
                            </Tooltip>
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
                            sx={{ mt: "45px" }}
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
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
            <LinearProgress className="progress-override" sx={{display: progressState ? "block": "none"}} />
        </AppBar>
    );
}
