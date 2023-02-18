import "../styles/globals.css";
import Layout from "../components/layout";
import Navbar from "../components/navbar";
import { withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
    cookieName: "tapewinder_user",
    password: "ANfzZjkR4szPasiv4@FKv#ECpA72yM^jFhfAC8^!#nNC9#6KaXhKdLQsn5VWs@GG",
    cookieOptions: {
        // this must not be deployed as false
        // but this value must be false to develop on http
        secure: process.env.REACT_APP_NODE_ENV === "production" ? true: false
    }
};

export default function App({ Component, pageProps }) {
    console.log(pageProps.user);
    return (
        <Layout>
            <Navbar loggedin={Boolean()} />
            <Component {...pageProps} />
        </Layout>
    );
}

export const getServerSideProps = withIronSessionSsr(
    async function getServerSideProps({ req }) {
        console.log(req.session);
        return {
            props: {
                user: req.session.user
            }
        };
    }, sessionOptions
); // todo fix 