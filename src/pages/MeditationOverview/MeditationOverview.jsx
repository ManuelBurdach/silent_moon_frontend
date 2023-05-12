import Navigation from "../../components/Navigation/Navigation";
import "./MeditationOverview.scss";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FilterAll from "../../assets/images/FilterAll.png";
import FilterFavorites from "../../assets/images/FilterFavorites.png";
import FilterBeginner from "../../assets/images/FilterBeginner.png";
import FilterIntermediate from "../../assets/images/FilterIntermediate.png";
import FilterExpert from "../../assets/images/FilterExpert.png";
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
    "7fClwWyhkvSEziZzCLNXuq",
    "37i9dQZF1DXcrbQpZuKaRH",
];

const MeditationOverview = () => {
    const [audios, setAudios] = useState([]);
    const [filteredAudios, setFilteredAudios] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    const [playlists, setPlaylists] = useState([]);

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
            })
            .catch((error) => {
                console.error("Error fetching playlists:", error);
            });
    }

    /* const filterTitle = (e) => {
    console.log(audios);
    if (e.target.value == "") {
        setFilteredAudios(audios);
    } else {
        setFilteredAudios(
        audios.filter((audio) => audio.title.toLowerCase().includes(e.target.value.toLowerCase()))
      );
    }
  }; */

    /* const filterBy = (property) => {
    if (property === "all") {
        setFilteredAudios(audios);
    } else if (property === "favorites") {
    } else {
        setFilteredAudios(
        audios.filter((audio) => audio.level.toLowerCase().includes(property.toLowerCase()))
      );
    }
  }; */

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
                            filterBy("beginner");
                        }}
                    >
                        <img src={FilterBeginner} alt="" />
                        <p className="textSmall">Beginner</p>
                    </button>
                    <button
                        onClick={() => {
                            filterBy("intermediate");
                        }}
                    >
                        <img src={FilterIntermediate} alt="" />
                        <p className="textSmall">Intermediate</p>
                    </button>
                    <button
                        onClick={() => {
                            filterBy("expert");
                        }}
                    >
                        <img src={FilterExpert} alt="" />
                        <p className="textSmall">Expert</p>
                    </button>
                </div>
            </article>
            <article className="searchAndAudios">
                <form>
                    <input type="text" />
                </form>
                <div className="dailyCalm">
                    <div>
                        <h3 className="heading2">Daily Calm</h3>
                        <p className="textSmall uppercase">
                            {monthNames[month]} {day} • pause practice
                        </p>
                    </div>
                    <img src={DailyCalmPlay} alt="play button" />
                </div>
                <div className="audioList">
                    {playlists.map((playlist) => (
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
