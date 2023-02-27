import { Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar } from "@mui/material";


export default function SongList({ tracks, startRenderingFrom }) {
    
    const secondsToPrettyMinutes = (seconds) => {
        const minutes = Math.floor(seconds/60);
        let remainderSeconds = seconds % 60;
        if (remainderSeconds < 10)
            remainderSeconds = "0" + remainderSeconds;
        return `${minutes}:${remainderSeconds}`;
    };

    // not sure why but this value coerces to a string and breaks the second list
    // easy hacky fix! yay!
    startRenderingFrom = Number(startRenderingFrom);

    return (
        <Grid container justifyContent="space-around" sx={{ mt: "30px" }}>
            <Grid item>
                <List>
                    {
                        tracks.titles.slice(0, startRenderingFrom).map((title, index) => (
                            <ListItem key={index}>
                                <ListItemAvatar>
                                    <Avatar src={tracks.avatars[index]} />
                                </ListItemAvatar>
                                <ListItemText primary={title}secondary={`${tracks.artists[index]}, ${secondsToPrettyMinutes(tracks.lengths[index])}`} />
                            </ListItem>
                        ))
                    }
                </List>
            </Grid>
            <Grid item sx={{ pr: "100px" }}>
                <List>
                    {
                        tracks.titles.slice(startRenderingFrom).map((track, index) => (
                            <ListItem key={track}>
                                <ListItemAvatar>
                                    {console.log(index+startRenderingFrom)}
                                    <Avatar src={tracks.avatars[startRenderingFrom+index]} />
                                </ListItemAvatar>
                                <ListItemText primary={track} secondary={`${tracks.artists[index+startRenderingFrom]}, ${secondsToPrettyMinutes(tracks.lengths[index+startRenderingFrom-1])}`} />
                            </ListItem>
                        ))
                    }
                </List>
            </Grid>
        </Grid>
    );
}