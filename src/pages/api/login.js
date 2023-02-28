import { withIronSessionApiRoute } from "iron-session/next";
import bcrypt from "bcrypt";
import isEmail from "isemail";
import { Pool } from "pg";

const user = "ACCOUNTMAN";
const hostname = "db.bit.io";
const port = 5432;
const db = "shr4pnel/users";
const dbpassword = process.env.REACT_APP_BIT_IO_KEY;
const ssl = true;

const pool = new Pool({
    user: user,
    host: hostname,
    database: db,
    password: dbpassword,
    port: port,
    ssl: ssl
});

const sessionOptions = {
    cookieName: "tapewinder_user",
    password: process.env.REACT_APP_PRIVATE_KEY,
    cookieOptions: {
        // this must not be deployed as false
        // but this value must be false to develop on http
        secure: process.env.NODE_ENV === "production" ? true : false 
    }
};

function rowsReturned(query) {
    return Boolean(query.rows.toString());
}

// validate() throws an error if the string isnt an email so we have to do it this way (boo)
function getEmailOrPassword(usernameOrEmail) {
    try {
        return isEmail.validate(usernameOrEmail);
    } catch {
        return false;
    }
}

export default withIronSessionApiRoute(
    function handler(req, res) {
        const body = typeof req.body === "object" ? req.body : JSON.parse(req.body);
        const queryString = getEmailOrPassword(body.usernameOrEmail) ? "email": "username";
        pool
            .query(`SELECT uid, hash, username FROM accounts WHERE ${queryString}=$1`, [body.usernameOrEmail])
            .then((query) => {
                if (!rowsReturned(query)) {
                    return res.status(401).json({ success: false, error: "These credentials are incorrect. Please try again." });
                }
                const userCredentials = query.rows[0];
                bcrypt.compare(body.password, userCredentials.hash, async (err, result) => {
                    if (result) {
                        req.session.user = {
                            id: userCredentials.uid,
                            username: userCredentials.username
                        };
                        await req.session.save();
                        return res.status(200).json({ success: true });
                    }
                });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).json({ success: false, error: "An unexpected error has occurred. Please try again in 5 minutes." });
            });
    }, sessionOptions);   
