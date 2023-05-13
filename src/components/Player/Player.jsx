import SpotifyPlayer from "react-spotify-web-playback";
import "./Player.scss";

const Player = ({ accessToken, trackUri }) => {
    if (!accessToken) return null;
    return (
        <SpotifyPlayer
            token={accessToken}
            showSaveIcon
            play
            uris={trackUri ? [trackUri] : []}
        />
    );
};

export default Player;
