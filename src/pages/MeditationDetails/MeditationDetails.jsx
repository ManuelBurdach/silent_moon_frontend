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

const MeditationDetails = ({ accessToken, id }) => {
    const [selectedPlaylist, setSelectedPlaylist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingTrack, setPlayingTrack] = useState();
    const [favoriteMeditation, setFavoriteMeditation] = useState([]);

    const nav = useNavigate();
    const user = userState((state) => state.user);

    let { playlistId } = useParams();
    let storedPlaylistId = id?.split("/")[1];
    playlistId = playlistId || storedPlaylistId;

    useEffect(() => {
        // Store the referrer in local storage
        localStorage.setItem("referrer", `meditationdetails/${playlistId}`);
    }, [playlistId]);

    spotifyApi.setAccessToken(accessToken);
    const cookieAccessToken = cookies.get("spotifyAccessToken");
    spotifyApi.setAccessToken(cookieAccessToken);

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

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(
                import.meta.env.VITE_BACKEND +
                    import.meta.env.VITE_API_VERSION +
                    "/user/details",
                { credentials: "include" }
            );
            if (response.ok) {
                const data = await response.json();
                setFavoriteMeditation(data.favoriteMeditation);
            } else {
                const result = response.json();
                throw new Error("Error getting user details");
            }
        } catch (error) {
            console.error("Error getting user details: ", error);
        }
    };

    const addFavorite = async (playlist) => {
        try {
            const response = await fetch(
                import.meta.env.VITE_BACKEND +
                    import.meta.env.VITE_API_VERSION +
                    "/user/addMeditateFav",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ favorite: playlist }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log("favorite saved");
                fetchUserDetails();
            } else {
                const result = response.json();
                throw new Error("Error saving favorite: " + result);
            }
        } catch (error) {
            console.error("Error saving favorite:", error);
        }
    };

    const deleteFavorite = async (playlist) => {
        try {
            const response = await fetch(
                import.meta.env.VITE_BACKEND +
                    import.meta.env.VITE_API_VERSION +
                    "/user/deleteMeditateFav",
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ favorite: playlist }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log("favorite deleted");
                fetchUserDetails();
            } else {
                const result = response.json();
                throw new Error("Error deleting favorite: " + result);
            }
        } catch (error) {
            console.error("Error deleting favorite:", error);
        }
    };

    if (loading) {
        return (
            <>
                <div className="lds-ripple">
                    <div></div>
                    <div></div>
                </div>
                <Navigation />
            </>
        );
    }

    return (
        <section id="meditationDetails">
            <Link to={"/meditate"}>
                <button className="backButton fill"></button>
            </Link>
            <button
                className={`likeButton ${
                    favoriteMeditation &&
                    favoriteMeditation.includes(selectedPlaylist.id)
                        ? "liked"
                        : ""
                }`}
                onClick={() =>
                    favoriteMeditation &&
                    favoriteMeditation.includes(selectedPlaylist.id)
                        ? deleteFavorite(selectedPlaylist.id)
                        : addFavorite(selectedPlaylist.id)
                }
            ></button>
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
                                        <Link to={`/spotify/login`}>
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
