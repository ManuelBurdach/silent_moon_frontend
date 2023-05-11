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
    const fetchData = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_BACKEND + import.meta.env.VITE_API_VERSION + "/data/videos",
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          data.sort((a, b) => b.favorites - a.favorites);
          setVideos(data);
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

  return (
    <section id="yogaOverview">
      <p className="logo">SILENT MOON</p>
      <article className="yogaHeaderandFilter">
        <h1 className="heading1">Yoga</h1>
        <p className="textSmall">Find your inner zen from anywhere.</p>
        <div>
          <button>
            <img src={FilterAll} alt="" />
            <p className="textSmall">All</p>
          </button>
          <button>
            <img src={FilterFavorites} alt="" />
            <p className="textSmall">Favorites</p>
          </button>
          <button>
            <img src={FilterBeginner} alt="" />
            <p className="textSmall">Beginner</p>
          </button>
          <button>
            <img src={FilterIntermediate} alt="" />
            <p className="textSmall">Intermediate</p>
          </button>
          <button>
            <img src={FilterExpert} alt="" />
            <p className="textSmall">Expert</p>
          </button>
        </div>
      </article>
      <article className="searchAndVideos">
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
        <div className="videoList">
          {videos.map((video) => (
            <Link to={`/yogadetails/${video._id}`} key={video._id}>
              <video controls={false}>
                <source src={videos.find((videoArray) => videoArray._id === video._id).url} />
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
