import { Pool } from "pg";
import { v4 } from "uuid";
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
        secure: false
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
        const uid = v4();
        const owner = req.session.user.id;
        const tracks = req.body;
        const title = req.body.title;
        const length = req.body.length;
        pool
            .query("INSERT INTO mixtapes VALUES ($1, $2, $3, $4, $5)", [uid, owner, tracks, title, length])
            .then(() => {
                res.status(201).json({ success: true });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ success: false });
            });
        
    }, sessionOptions
);