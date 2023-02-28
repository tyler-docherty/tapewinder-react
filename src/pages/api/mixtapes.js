import { Pool } from "pg";
import { withIronSessionApiRoute } from "iron-session/next";

const user = "ACCOUNTMAN";
const hostname = "db.bit.io";
const port = 5432;
const db = "shr4pnel/users";
const dbpassword = process.env.REACT_APP_BIT_IO_KEY;
const ssl = true;

const sessionOptions = {
    cookieName: "tapewinder_user",
    password: process.env.REACT_APP_PRIVATE_KEY,
    cookieOptions: {
        // this must not be deployed as false
        // but this value must be false to develop on http
        secure: process.env.NODE_ENV === "production" ? true : false 
    }
};

const pool = new Pool({
    user: user,
    host: hostname,
    database: db,
    password: dbpassword,
    port: port,
    ssl: ssl
});


export default withIronSessionApiRoute(
    async function handler(req, res) {
        let owner = null;
        try {
            owner = req.session.user.id;
        } catch {
            return res.status(400).json({ success: false });
        }
        pool
            .query("SELECT mixtapes.tracks FROM accounts INNER JOIN mixtapes ON accounts.uid=mixtapes.owner AND accounts.uid=$1", [owner])
            .then((query) => {
                res.status(201).json({ success: true, tracks: query.rows });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ success: false });
            });
        
    }, sessionOptions
);