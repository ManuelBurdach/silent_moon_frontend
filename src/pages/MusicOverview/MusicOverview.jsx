import { useState, useEffect } from "react";
import "./MusicOverview.scss";
import Navigation from "../../components/Navigation/Navigation";
import Player from "../../components/Player/Player";
import SpotifyWebApi from "spotify-web-api-node";
import Cookies from "universal-cookie";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const PLAYLIST_ID = "37i9dQZF1DWYBO1MoTDhZI";

const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
});

const cookies = new Cookies();

const MusicOverview = ({ accessToken }) => {
    const [playlist, setPlaylist] = useState(null);
    const [playingTrack, setPlayingTrack] = useState();

    useEffect(() => {
        spotifyApi.setAccessToken(accessToken);
        fetchPlaylist(accessToken);
    }, [accessToken]);

    // Fetch Playlist
    function fetchPlaylist(accessToken) {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        fetch(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}`, {
            headers: headers,
        })
            .then((result) => result.json())
            .then((data) => setPlaylist(data));
    }

    return (
        <section id="musicOverview">
            <p className="logo">SILENT MOON</p>

            <h1 className="heading1">{playlist ? playlist.name : ""}</h1>
            <p className="textSmall uppercase">Playlist</p>
            <p className="textSmall">Breathe. Sense. Feel. Transcend.</p>
            {playlist && (
                <div className="likesAndSongs">
                    <p className="textSmall musicFavoritesAndViews musicFavorites">
                        {playlist.followers.total
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                        Favorites
                    </p>
                    <p className="textSmall musicFavoritesAndViews musicViews">
                        {playlist.tracks.total
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                        Songs
                    </p>
                </div>
            )}

            <article className="allSongs">
                {playlist &&
                    playlist.tracks &&
                    playlist.tracks.items.map((item) => (
                        <div
                            key={item.track.id}
                            onClick={() => {
                                setPlayingTrack(item.track);
                            }}
                        >
                            <h3 className="heading2">{item.track.name}</h3>
                            <p className="textSmall">{`${Math.floor(
                                item.track.duration_ms / 60000
                            )}:${
                                (
                                    (item.track.duration_ms % 60000) /
                                    1000
                                ).toFixed(0) < 10
                                    ? "0"
                                    : ""
                            }${(
                                (item.track.duration_ms % 60000) /
                                1000
                            ).toFixed(0)}`}</p>
                        </div>
                    ))}
            </article>
            <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
            <Navigation />
        </section>
    );
};

export default MusicOverview;
