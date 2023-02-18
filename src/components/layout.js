import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    }
});

export default function Layout({ children, nav }) {
    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <div>
                    <Head>
                        <title>tapewinder</title>
                    </Head>
                    {nav}
                    <main>{children}</main>
                </div>
            </ThemeProvider>
        </>
    );
}