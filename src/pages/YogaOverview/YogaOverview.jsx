import Navigation from "../../components/Navigation/Navigation";
import "./YogaOverview.scss";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import FilterAll from "../../assets/images/FilterAll.png";
import FilterFavorites from "../../assets/images/FilterFavorites.png";
import FilterBeginner from "../../assets/images/FilterBeginner.png";
import FilterIntermediate from "../../assets/images/FilterIntermediate.png";
import FilterExpert from "../../assets/images/FilterExpert.png";
import DailyCalmPlay from "../../assets/images/DailyCalmPlay.png";
import { userState } from "../../state/userState";

const YogaOverview = () => {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setfilteredVideos] = useState([]);
    const [favoriteVideos, setFavoriteVideos] = useState([]);
    const [randomVideo, setRandomVideo] = useState(null);

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

    const filterTitle = (e) => {
        if (e.target.value == "") {
            setfilteredVideos(videos);
        } else {
            setfilteredVideos(
                videos.filter((video) =>
                    video.title
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                )
            );
        }
    };

    useEffect(() => {
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
                    setfilteredVideos(data);
                } else {
                    const result = response.json();
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
                    setFavoriteVideos(data.favoriteYoga);
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

    const filterBy = (property) => {
        if (property === "all") {
            setfilteredVideos(videos);
        } else if (property === "favorites") {
            setfilteredVideos(favoriteVideos);
        } else {
            setfilteredVideos(
                videos.filter((video) =>
                    video.level.toLowerCase().includes(property.toLowerCase())
                )
            );
        }
    };

    useEffect(() => {
        if (videos.length > 0) {
            const randomIndex = Math.floor(Math.random() * videos.length);
            setRandomVideo(videos[randomIndex]);
        }
    }, [videos]);

    console.log(randomVideo);

    return (
        <section id="yogaOverview">
            <p className="logo">SILENT MOON</p>
            <article className="yogaHeaderandFilter">
                <h1 className="heading1">Yoga</h1>
                <p className="textSmall">Find your inner zen from anywhere.</p>
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
            <article className="searchAndVideos">
                <form>
                    <input type="text" onChange={filterTitle} />
                </form>
                {randomVideo && (
                    <Link to={`/yogadetails/${randomVideo._id}`}>
                        <div className="dailyCalm">
                            <div>
                                <h3 className="heading2">Daily Calm</h3>
                                <p className="textSmall uppercase">
                                    {monthNames[month]} {day} • pause practice
                                </p>
                            </div>
                            <img src={DailyCalmPlay} alt="play button" />
                        </div>
                    </Link>
                )}
                <div className="videoList">
                    {filteredVideos.map((video) => (
                        <Link to={`/yogadetails/${video._id}`} key={video._id}>
                            <video controls={false}>
                                <source
                                    src={
                                        videos.find(
                                            (videoArray) =>
                                                videoArray._id === video._id
                                        ).url
                                    }
                                />
                            </video>

                            <h3 className="heading2">{video.title}</h3>
                        </Link>
                    ))}
                </div>
            </article>
            <Navigation />
        </section>
    );
};

export default YogaOverview;
