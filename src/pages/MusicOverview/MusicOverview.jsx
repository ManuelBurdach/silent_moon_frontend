import { useState, useEffect } from "react";
import "./MusicOverview.scss";
import Navigation from "../../components/Navigation/Navigation";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const PLAYLIST_ID = "37i9dQZF1DWYBO1MoTDhZI";

const MusicOverview = () => {
    /*     const [searchInput, setSearchInput] = useState(""); */
    const [accessToken, setAccessToken] = useState("");
    const [playlist, setPlaylist] = useState(null);

    useEffect(() => {
        // API Access Token
        var authParameters = {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body:
                "grant_type=client_credentials&client_id=" +
                CLIENT_ID +
                "&client_secret=" +
                CLIENT_SECRET,
        };

        fetch("https://accounts.spotify.com/api/token", authParameters)
            .then((result) => result.json())
            .then((data) => {
                setAccessToken(data.access_token);
                fetchPlaylist(data.access_token);
            });
    }, []);

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
                        <div key={item.track.id}>
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
            <Navigation />
        </section>
    );
};

export default MusicOverview;
