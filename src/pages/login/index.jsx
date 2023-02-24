import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "../../components/navbar";

export default function Index() {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [alert, setAlert] = useState(false);
    const router = useRouter();

    function formSubmit(event) {
        const target = event.target;
        const [usernameOrEmail, password] = [target[0].value, target[1].value];
        const body = {
            usernameOrEmail: usernameOrEmail,
            password: password
        };
        fetch("/api/login", {
            method: "POST",
            mode: "same-origin",
            credentials: "include",
            body: JSON.stringify(body)
        })  
            .then((res) => res.json())
            .then((res) => {
                if (res.success) {
                    setAlert(<Alert severity="success">Signed in! Redirecting...</Alert>);
                    setTimeout(() => {
                        setShouldRedirect(true);
                    }, 1000);
                }
                else {
                    setAlert(<Alert severity="error">{res.error}</Alert>);
                }
            });
        event.preventDefault();
    }
    
    useEffect(() => {
        if (shouldRedirect) {
            setShouldRedirect(false);
            router.push("/");
        }
    }, [router, shouldRedirect, setShouldRedirect]);

    return (
        <> 
            <Navbar />
            {alert}
            <div className="tapewinder-form" style={{display: "flex"}}>
                <form className="form" onSubmit={formSubmit}>
                    <h1>Log in</h1>
                    <TextField id="username" label="Username/Email" variant="standard" sx={{width: "90%", marginBottom: "16px"}} />
                    <TextField id="password" label="Password" variant="standard" type="password" autoComplete="current-password" sx={{width: "90%", marginBottom: "40px"}} />
                    <div>
                        <Button type="submit" variant="contained" sx={{width: "90%"}}>Confirm</Button>
                    </div>
                </form>
            </div>
        </>
    );
}