import Navigation from "../../components/Navigation/Navigation";
import "./MeditationOverview.scss";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FilterAll from "../../assets/images/FilterAll.png";
import FilterFavorites from "../../assets/images/FilterFavorites.png";
import FilterShort from "../../assets/images/FilterShort.png";
import FilterMedium from "../../assets/images/FilterMedium.png";
import FilterExtended from "../../assets/images/FilterExtended.png";
import DailyCalmPlay from "../../assets/images/DailyCalmPlay.png";
import { userState } from "../../state/userState";

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
    "4yJBBnNg20wh1pRTySqVj2?si=2e553e7c2fb64fbf",
    "37i9dQZF1DWVS1recTqXhf?si=dba03f9e2000485b",
];

const MeditationOverview = () => {
    const [filteredPlaylists, setFilteredPlaylists] = useState([]);
    const [favoritePlaylists, setFavoritePlaylists] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    const [playlists, setPlaylists] = useState([]);
    const [randomPlaylist, setRandomPlaylist] = useState({});

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

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
                fetchPlaylists(data.access_token);
            });
    }, []);

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
                setFilteredPlaylists(data);
            })
            .catch((error) => {
                console.error("Error fetching playlists:", error);
            });
    }
    function fetchFavorties(accessToken) {
        const headers = {
            Authorization: `Bearer ${accessToken}`,
        };

        const promises = favoritePlaylists.map((playlistId) =>
            fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
                headers: headers,
            }).then((result) => result.json())
        );

        Promise.all(promises)
            .then((data) => {
                setFilteredPlaylists(data);
            })
            .catch((error) => {
                console.error("Error fetching playlists:", error);
            });
    }

    useEffect(() => {
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
                    setFavoritePlaylists(data.favoriteMeditation);
                } else {
                    const result = response.json();
                    throw new Error("Error getting user details");
                }
            } catch (error) {
                console.error("Error getting user details: ", error);
            }
        };
        fetchUserDetails();
    }, []);

    const filterTitle = (e) => {
        if (e.target.value == "") {
            setFilteredPlaylists(playlists);
        } else {
            setFilteredPlaylists(
                playlists.filter((playlist) =>
                    playlist.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                )
            );
        }
    };

    const filterBy = (property) => {
        if (property === "all") {
            setFilteredPlaylists(playlists);
        } else if (property === "favorites") {
            fetchFavorties(accessToken);
        } else if (property === "short") {
            const playlistsWithLessThan100Songs = playlists.filter(
                (playlist) => playlist.tracks.total < 100
            );
            setFilteredPlaylists(playlistsWithLessThan100Songs);
        } else if (property === "medium") {
            const playlistsBetween100And200Songs = playlists.filter(
                (playlist) =>
                    playlist.tracks.total >= 100 && playlist.tracks.total <= 200
            );
            setFilteredPlaylists(playlistsBetween100And200Songs);
        } else if (property === "extended") {
            const playlistsBetween100And200Songs = playlists.filter(
                (playlist) => playlist.tracks.total > 200
            );
            setFilteredPlaylists(playlistsBetween100And200Songs);
        }
    };

    useEffect(() => {
        if (playlists.length > 0) {
            const randomIndex = Math.floor(Math.random() * playlists.length);
            setRandomPlaylist(playlists[randomIndex]);
        }
    }, [playlists]);

    console.log(randomPlaylist);

    return (
        <section id="meditationOverview">
            <p className="logo">SILENT MOON</p>
            <article className="meditationHeaderandFilter">
                <h1 className="heading1">Meditate</h1>
                <p className="textSmall">
                    Audio-only meditation techniques to help you minimize your
                    screen time and practice on the go.
                </p>
                <div>
                    <button
                        onClick={() => {
                            filterBy("all");
                        }}
                    >
                        <img src={FilterAll} alt="" />
                        <p className="textSmall">All</p>
                    </button>
                    <button
                        onClick={() => {
                            filterBy("favorites");
                        }}
                    >
                        <img src={FilterFavorites} alt="" />
                        <p className="textSmall">Favorites</p>
                    </button>
                    <button
                        onClick={() => {
                            filterBy("short");
                        }}
                    >
                        <img src={FilterShort} alt="" />
                        <p className="textSmall">Short</p>
                    </button>
                    <button
                        onClick={() => {
                            filterBy("medium");
                        }}
                    >
                        <img src={FilterMedium} alt="" />
                        <p className="textSmall">Medium</p>
                    </button>
                    <button
                        onClick={() => {
                            filterBy("extended");
                        }}
                    >
                        <img src={FilterExtended} alt="" />
                        <p className="textSmall">Extended</p>
                    </button>
                </div>
            </article>
            <article className="searchAndAudios">
                <form>
                    <input type="text" onChange={filterTitle} />
                </form>
                <Link to={`/meditatedetails/${randomPlaylist.id}`}>
                    <div className="dailyCalm">
                        <div>
                            <h3 className="heading2">Daily Calm</h3>
                            <p className="textSmall uppercase">
                                {monthNames[month - 1]} {day} • pause practice
                            </p>
                        </div>

                        <img src={DailyCalmPlay} alt="play button" />
                    </div>
                </Link>
                <div className="audioList">
                    {filteredPlaylists.map((playlist) => (
                        <Link
                            to={`/meditatedetails/${playlist.id}`}
                            key={playlist.id}
                        >
                            <img src={playlist.images[0].url} alt="" />
                            <h3 className="heading2">{playlist.name}</h3>
                        </Link>
                    ))}
                </div>
            </article>
            <Navigation />
        </section>
    );
};

export default MeditationOverview;
