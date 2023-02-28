import { withIronSessionApiRoute } from "iron-session/next";

const sessionOptions = {
    cookieName: "tapewinder_user",
    password: process.env.REACT_APP_PRIVATE_KEY,
    cookieOptions: {
        // this must not be deployed as false
        // but this value must be false to develop on http
        secure: process.env.NODE_ENV === "production" ? true : false 
    }
};

export default withIronSessionApiRoute(
    function handler(req, res) {
        req.session.destroy();
        res.status(200).json({ success: true });
    }, sessionOptions
);