import Avatar from "@mui/material/Avatar";

export default function UserAvatar({ src, alt, styles }) {
    return (
        <div style={styles}>
            <Avatar src={src} alt={alt} className="avatar" />
        </div>
    );
}

UserAvatar.defaultProps = {
    styles: {}
};