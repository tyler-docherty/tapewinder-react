import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Index() {
    return (
        <>
            <div className="tapewinder-form">
                <form>
                    <h1>Sign up</h1>
                    <TextField id="username" label="Username" variant="standard" sx={{width: "90%", marginBottom: "16px"}} />
                    <TextField id="email" label="Email" variant="standard" type="email" sx={{width: "90%", marginBottom: "16px"}} />
                    <TextField id="password" label="Password" variant="standard" type="password" autoComplete="current-password" sx={{width: "90%", marginBottom: "16px"}} />
                    <TextField id="password" label="Confirm Password" variant="standard" type="password" autoComplete="current-password" sx={{width: "90%", marginBottom: "40px"}} />
                    <div>
                        <Button variant="contained" sx={{width: "90%"}}>Confirm</Button>
                    </div>
                </form>
            </div>
        </>
    );
}