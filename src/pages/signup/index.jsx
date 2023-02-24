import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import "@fontsource/roboto";


export default function Index() {
    const [hasPasswordError, setHasPasswordError] = useState(false);
    const [hasEmailError, setHasEmailError] = useState(false);
    const [hasUsernameError, setHasUsernameError] = useState(false);
    const [passwordAlert, setPasswordAlert] = useState(false);
    const [emailAlert, setEmailAlert] = useState(false);
    const [usernameAlert, setUsernameAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (shouldRedirect) {
            setShouldRedirect(false);
            router.push("/");
        }
    }, [router, shouldRedirect, setShouldRedirect]);

    function getExternalWarnings(errors) {
        if (errors.email) {
            const text = "This email is invalid or is already in use. Please enter another email address.";
            setEmailAlert(<Alert severity="error">{text}</Alert>);
            setHasEmailError(true);
        } else {
            setEmailAlert(false);
            setHasEmailError(false);
            setSuccessAlert(false);
        }

        if (errors.username) {
            const text = "This username is invalid or is already in use. Please enter another username.";
            setHasUsernameError(true);
            setUsernameAlert(<Alert severity="error">{text}</Alert>);
        } 
        else {
            setHasUsernameError(false);
            setUsernameAlert(false);
            setSuccessAlert(false);
        }

    }

    function formSubmit(event) {
        const target = event.target;
        const [username, email, password, passwordconfirm] = [target[0], target[1], target[2], target[3]];

        // internal checks
        if (password.value !== passwordconfirm.value) {
            setHasPasswordError(true);
            const text = "These passwords did not match. Please try again";
            setPasswordAlert(<Alert severity="error">{text}</Alert>);
            event.preventDefault();
            return;
        } else {
            setHasPasswordError(false);
        }

        // external checks
        const body = {
            "email": email.value,
            "password": password.value,
            "username": username.value
        };

        fetch("/api/signup", {
            method: "POST", 
            mode: "no-cors", 
            body: JSON.stringify(body),
            redirect: "follow", 
            headers: {
                "Content-Type": "application/json"
            }})
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    setSuccessAlert(<Alert severity="success">Account created successfully!</Alert>);
                    setTimeout(() => {
                        setShouldRedirect(true);
                    }, 500);
                } else {
                    getExternalWarnings(res.errors);
                }
            })
            .catch((err) => {
                console.error(err, "in err jsx");
            });
        event.preventDefault();
    }

    return (
        <>
            <Navbar />
            {passwordAlert}
            {emailAlert}
            {usernameAlert}
            {successAlert}
            <div className="tapewinder-form">
                <form className="form" onSubmit={formSubmit}>
                    <h1>Sign up</h1>
                    <TextField id="username" label="Username" variant="standard" error={hasUsernameError} sx={{width: "90%", marginBottom: "16px"}} />
                    <TextField id="email" label="Email" variant="standard" type="email" error={hasEmailError} sx={{width: "90%", marginBottom: "16px"}} />
                    <TextField id="password" label="Password" variant="standard" type="password" autoComplete="current-password" error={hasPasswordError} sx={{width: "90%", marginBottom: "16px"}} />
                    <TextField id="passwordconfirm" label="Confirm Password" variant="standard" type="password" autoComplete="current-password" error={hasPasswordError} sx={{width: "90%"}} />
                    <div>
                        <Button variant="contained" sx={{ marginTop: "32px", width: "90%"}} type="submit">Confirm</Button>
                    </div>
                    <Typography variant="body2" align="center" sx={{marginTop: "20px", width: "97%"}}>Your password must contain an uppercase letter, a lowercase letter, a number and a symbol. Your username must be between 3 and 20 characters and only contain numbers and letters.</Typography>
                </form>
            </div>
        </>
    );
}
