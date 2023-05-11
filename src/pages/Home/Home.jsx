import { Link } from "react-router-dom";
import "./Home.scss";
import React, { useEffect, useState } from "react";
import { userState } from "../../state/userState";
import Navigation from "../../components/Navigation/Navigation";

const Home = () => {
    const [videos, setVideos] = useState([]);

    const user = userState((state) => state.user);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    import.meta.env.VITE_BACKEND +
                        import.meta.env.VITE_API_VERSION +
                        "/data/videos"
                );
                if (response.ok) {
                    const data = await response.json();
                    data.sort((a, b) => b.favorites - a.favorites);
                    setVideos(data);
                } else {
                    throw new Error("Error fetching videos");
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <section id="home">
            <h4 className="logo">SILENT MOON</h4>

            <article className="homeHeader">
                <h2 className="heading2">Good morning {user.firstName}</h2>
                <p className="textSmall">We hope you have a good day</p>
            </article>
            <article className="homeVideos">
                <h2 className="heading2">Recommended Yoga for you</h2>
                <div>
                    {videos.map((video) => (
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
                            <div>
                                <p className="textSmall uppercase">
                                    {video.level}
                                </p>
                                <p className="textSmall uppercase">
                                    {video.duration}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </article>
            <Navigation />
        </section>
    );
};

export default Home;
