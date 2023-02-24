import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    }
});

export default function Layout({ children }) {
    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <div>
                    <Head>
                        <title>tapewinder</title>
                    </Head>
                    <main>{children}</main>
                </div>
            </ThemeProvider>
        </>
    );
}