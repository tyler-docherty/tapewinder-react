import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Index() {
    return (
        <>
            <div className="tapewinder-form" style={{display: "flex"}}>
                <form>
                    <h1>Log in</h1>
                    <TextField id="username" label="Username/Email" variant="standard" sx={{width: "90%", marginBottom: "16px"}} />
                    <TextField id="password" label="Password" variant="standard" type="password" autoComplete="current-password" sx={{width: "90%", marginBottom: "40px"}} />
                    <div>
                        <Button variant="contained" sx={{width: "90%"}}>Confirm</Button>
                    </div>
                </form>
            </div>
        </>
    );
}