const apiPath = "https://api.deezer.com";

export default async function handler(req, res) {
    const query = req.query.q;
    fetch(`${apiPath}/search/track/?q=${query}&output=JSON&limit=5`, {
        method: "GET",
        mode: "cors",
        credentials: "omit"
    })
        .then((result) => result.json())
        .then((result) => {
            return res.status(200).json({ success: true, content: result });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ success: false });
        });
}