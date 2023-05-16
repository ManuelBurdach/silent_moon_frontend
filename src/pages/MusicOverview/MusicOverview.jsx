import { useState, useEffect } from "react";
import "./MusicOverview.scss";
import Navigation from "../../components/Navigation/Navigation";
import Player from "../../components/PlayerSmall/Player";
import SpotifyWebApi from "spotify-web-api-node";
import { useNavigate, Link } from "react-router-dom";
import PlayButton from "../../assets/images/MusicPlayIcon.png";
import Cookies from "universal-cookie";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const PLAYLIST_ID = "37i9dQZF1DWYBO1MoTDhZI";

const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
});

const cookies = new Cookies();

const MusicOverview = ({ accessToken }) => {
    const [playlist, setPlaylist] = useState(null);
    const [playingTrack, setPlayingTrack] = useState();

    const navigate = useNavigate();

    spotifyApi.setAccessToken(accessToken);

    const cookieAccessToken = cookies.get("spotifyAccessToken");
    spotifyApi.setAccessToken(cookieAccessToken);

    console.log(accessToken);
    console.log(cookieAccessToken);

    useEffect(() => {
        // get basic authorization for Spotify (no access to player)
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
                fetchPlaylist(data.access_token);
            });
    }, []);

    // Fetch Playlist
    function fetchPlaylist(spotifyAuthorization) {
        const headers = {
            Authorization: `Bearer ${spotifyAuthorization}`,
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
                            {accessToken || cookieAccessToken ? (
                                <button
                                    onClick={() => setPlayingTrack(item.track)}
                                >
                                    <img src={PlayButton} alt="play button" />
                                </button>
                            ) : (
                                <Link to="/music/login/musicoverview">
                                    <img src={PlayButton} alt="play button" />
                                </Link>
                            )}
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
            <Player
                accessToken={accessToken || cookieAccessToken}
                trackUri={playingTrack?.uri}
            />
            <Navigation />
        </section>
    );
};

export default MusicOverview;
