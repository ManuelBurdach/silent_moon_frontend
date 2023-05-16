import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
import "./PlayerLarge.scss";
import LikeButton from "../LikeButton/LikeButton";

const SpotifyPlayerLarge = ({ accessToken, trackUri, setPlayingTrack }) => {
    useEffect(() => {
        const playerElement = document.querySelector(".PlayerRSWP");
        if (playerElement) {
            playerElement.style.backgroundColor = "rgba(255, 255, 255, 0)";
        }
    }, []);

    if (!accessToken) return null;
    return (
        <div id="spotifyPlayerLarge">
            <button
                onClick={() => setPlayingTrack(null)}
                id="backButton"
            ></button>
            <LikeButton />
            <SpotifyPlayer
                token={accessToken}
                showSaveIcon
                callback={(state) => {
                    if (!state.isPlaying) setPlay(false);
                }}
                play={true}
                uris={trackUri ? [trackUri] : []}
            />
        </div>
    );
};

export default SpotifyPlayerLarge;
