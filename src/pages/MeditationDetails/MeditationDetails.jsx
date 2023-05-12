import { useNavigate, useParams } from "react-router-dom";
import "./MeditationDetails.scss";
import { useState, useRef, useEffect } from "react";
import Navigation from "../../components/Navigation/Navigation";
import BackButton from "../../components/BackButton/BackButton";
import LikeButton from "../../components/LikeButton/LikeButton";
import { userState } from "../../state/userState";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const MeditationDetails = () => {
    const [selectedPlaylist, setSelectedPlaylist] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    const [loading, setLoading] = useState(true);

    let { playlistId } = useParams();
    const nav = useNavigate();
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
                setAccessToken(data.access_token);
                fetchPlaylist(data.access_token);
            });
    }, []);

    function fetchPlaylist(accessToken) {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
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
                                <div
                                    key={item.track.id}
                                    onClick={() => playSong(item.track.uri)}
                                >
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
        </section>
    );
};

export default MeditationDetails;
