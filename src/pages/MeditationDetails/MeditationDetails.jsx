import { useNavigate, useParams, Link } from "react-router-dom";
import "./MeditationDetails.scss";
import { useState, useRef, useEffect } from "react";
import Navigation from "../../components/Navigation/Navigation";
import BackButton from "../../components/BackButton/BackButton";
import LikeButton from "../../components/LikeButton/LikeButton";
import { userState } from "../../state/userState";
import SpotifyWebApi from "spotify-web-api-node";
import Cookies from "universal-cookie";
import PlayButton from "../../assets/images/MusicPlayIcon.png";
import SpotifyPlayerLarge from "../../components/PlayerLarge/PlayerLarge";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
});

const cookies = new Cookies();

const MeditationDetails = ({ accessToken }) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingTrack, setPlayingTrack] = useState();

    const nav = useNavigate();

    spotifyApi.setAccessToken(accessToken);

    const cookieAccessToken = cookies.get("spotifyAccessToken");
    spotifyApi.setAccessToken(cookieAccessToken);

    let { playlistId } = useParams();
    const setUser = userState((state) => state.setUser);

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
                fetchPlaylist(data.access_token);
            });
    }, []);

    function fetchPlaylist(spotifyAuthorization) {
        const headers = {
            Authorization: `Bearer ${spotifyAuthorization}`,
        };

        fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: headers,
        })
            .then((result) => result.json())
            .then((data) => {
                setSelectedPlaylist(data);
                setLoading(false);
            });
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <section id="meditationDetails">
            <BackButton addClass="fill" />
            <LikeButton />
            {selectedPlaylist && ( // Add conditional rendering for selectedPlaylist
                <div>
                    <article className="meditationPlaylist">
                        <img src={selectedPlaylist.images[0].url} alt="" />
                    </article>
                    <article className="meditationDetails">
                        <h1 className="heading1">{selectedPlaylist.name}</h1>
                        <p className="textSmall uppercase">Playlist</p>
                        <p className="textSmall">
                            {selectedPlaylist.description}
                        </p>
                        <div className="likesAndSongs">
                            <p className="textSmall meditationFavoritesAndViews meditationFavorites">
                                {selectedPlaylist.followers.total
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                Favorites
                            </p>
                            <p className="textSmall meditationFavoritesAndViews meditationViews">
                                {selectedPlaylist.tracks.total
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                Songs
                            </p>
                        </div>
                    </article>
                    <article className="allSongs">
                        {selectedPlaylist &&
                            selectedPlaylist.tracks &&
                            selectedPlaylist.tracks.items.map((item) => (
                                <div key={item.track.id}>
                                    {accessToken || cookieAccessToken ? (
                                        <button
                                            onClick={() =>
                                                setPlayingTrack(item.track)
                                            }
                                        >
                                            <img
                                                src={PlayButton}
                                                alt="play button"
                                            />
                                        </button>
                                    ) : (
                                        <Link to="/music/login/meditationdetails">
                                            <img
                                                src={PlayButton}
                                                alt="play button"
                                            />
                                        </Link>
                                    )}

                                    <h3 className="heading2">
                                        {item.track.name}
                                    </h3>
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
                </div>
            )}

            <Navigation />
            {playingTrack && (
                <SpotifyPlayerLarge
                    accessToken={accessToken || cookieAccessToken}
                    trackUri={playingTrack?.uri}
                    setPlayingTrack={setPlayingTrack}
                />
            )}
        </section>
    );
};

export default MeditationDetails;
