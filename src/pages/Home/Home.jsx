import { Link, useNavigate } from "react-router-dom";
import "./Home.scss";
import React, { useEffect, useState } from "react";
import { userState } from "../../state/userState";
import Navigation from "../../components/Navigation/Navigation";
import DefaultResult from "../../assets/images/DefaultResult.png";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const PLAYLIST_IDS = [
    "37i9dQZF1DX9uKNf5jGX6m",
    "6F3XLbhB0ZJh6U3kJo3l0d",
    "37i9dQZF1DX3SEFZskKvKB",
    "6oSCiPbD9jDFDrptL4bHUe",
    "37i9dQZF1DX1tuUiirhaT3",
    "0yCMKirBx8uUV9vmBBjTH8",
    "37i9dQZF1DXb7eLtQI7KhP",
    "7fClwWyhkvSEziZzCLNXuq",
    "37i9dQZF1DXcrbQpZuKaRH",
];

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    const [playlists, setPlaylists] = useState([]);
    const [randomVideo, setRandomVideo] = useState(null);
    const [randomMeditation, setRandomMeditation] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const user = userState((state) => state.user);
    const setUser = userState((state) => state.setUser);
    const nav = useNavigate();

    useEffect(() => {
        // First useEffect: Fetch access token
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
            });
    }, []);

    useEffect(() => {
        // Second useEffect: Fetch playlists
        if (accessToken) {
            fetchPlaylists(accessToken);
        }
    }, [accessToken]);

    useEffect(() => {
        // Third useEffect: Fetch videos
        const fetchData = async () => {
            try {
                const response = await fetch(
                    import.meta.env.VITE_BACKEND +
                        import.meta.env.VITE_API_VERSION +
                        "/data/videos",
                    { credentials: "include" }
                );
                if (response.ok) {
                    const data = await response.json();
                    data.sort((a, b) => b.favorites - a.favorites);
                    setVideos(data);
                } else {
                    const result = await response.json();
                    setUser(result);
                    nav("/login");
                    throw new Error("Error fetching videos");
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Fourth useEffect: Select random video and meditation
        if (videos.length > 0 && playlists.length > 0) {
            const randomIndex = Math.floor(Math.random() * videos.length);
            setRandomVideo(videos[randomIndex]);

            const randomPlaylistIndex = Math.floor(
                Math.random() * playlists.length
            );
            setRandomMeditation(playlists[randomPlaylistIndex]);
        }
    }, [videos, playlists]);

    function fetchPlaylists(accessToken) {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const promises = PLAYLIST_IDS.map((playlistId) =>
            fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                headers: headers,
            }).then((result) => result.json())
        );

        Promise.all(promises)
            .then((data) => {
                setPlaylists(data);
            })
            .catch((error) => {
                console.error("Error fetching playlists:", error);
            });
    }

    return (
        <section id="home">
            <h4 className="logo">SILENT MOON</h4>

            <article className="homeHeader">
                <h2 className="heading2">Good morning {user.firstName}</h2>
                <p className="textSmall">We hope you have a good day</p>
            </article>
            {randomMeditation && randomVideo && (
                <article id="randomSuggestions">
                    <div>
                        <Link
                            to={`/yogadetails/${randomVideo._id}`}
                            key={randomVideo._id}
                        >
                            {randomVideo.url ? (
                                <video controls={false}>
                                    <source src={randomVideo.url} />
                                </video>
                            ) : (
                                <img src={DefaultResult} alt="" />
                            )}

                            <h3 className="heading2">{randomVideo.title}</h3>

                            <p className="textSmall uppercase">
                                {randomVideo.level}
                            </p>
                            <p className="textSmall uppercase">
                                {randomVideo.duration} min
                            </p>
                            <p className="textSmall uppercase">Start</p>
                        </Link>
                    </div>
                    <div>
                        <Link
                            to={`/meditatedetails/${randomMeditation.id}`}
                            key={randomMeditation.id}
                        >
                            {randomMeditation.images[0].url ? (
                                <img
                                    src={randomMeditation.images[0].url}
                                    alt=""
                                />
                            ) : (
                                <img src={DefaultResult} alt="" />
                            )}
                            <h3 className="heading2">
                                {randomMeditation.name}
                            </h3>

                            <p className="textSmall uppercase">playlist</p>
                            <p className="textSmall uppercase">
                                {randomMeditation.tracks.total} items
                            </p>
                            <p className="textSmall uppercase">Start</p>
                        </Link>
                    </div>
                </article>
            )}
            <form>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
            <article className="homeVideos">
                <h2 className="heading2">Recommended Yoga for you</h2>
                <div>
                    {videos
                        .filter((video) =>
                            video.title
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                        )
                        .map((video) => (
                            <Link
                                to={`/yogadetails/${video._id}`}
                                key={video._id}
                            >
                                <video controls={false}>
                                    <source src={video.url} />
                                </video>

                                <h3 className="heading2">{video.title}</h3>
                                <div>
                                    <p className="textSmall uppercase">
                                        {video.level}
                                    </p>
                                    <p className="textSmall uppercase">
                                        {video.duration} min
                                    </p>
                                </div>
                            </Link>
                        ))}
                    {videos.filter((video) =>
                        video.title
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                        <Link>
                            <img src={DefaultResult} alt="" />

                            <h3 className="heading2">No yoga video found</h3>
                        </Link>
                    )}
                </div>
            </article>
            <article className="homeVideos">
                <h2 className="heading2">Recommended Meditations for you</h2>
                <div>
                    {playlists
                        .filter((playlist) =>
                            playlist.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                        )
                        .map((playlist) => (
                            <Link
                                to={`/meditatedetails/${playlist.id}`}
                                key={playlist.id}
                            >
                                <img src={playlist.images[0].url} alt="" />

                                <h3 className="heading2">{playlist.name}</h3>
                                <div>
                                    <p className="textSmall uppercase">
                                        playlist
                                    </p>
                                    <p className="textSmall uppercase">
                                        {playlist.tracks.total} items
                                    </p>
                                </div>
                            </Link>
                        ))}
                    {playlists.filter((playlist) =>
                        playlist.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                        <Link>
                            <img src={DefaultResult} alt="" />

                            <h3 className="heading2">No meditation found</h3>
                        </Link>
                    )}
                </div>
            </article>
            <Navigation />
        </section>
    );
};

export default Home;
