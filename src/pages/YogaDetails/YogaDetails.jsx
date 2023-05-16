import { useNavigate, useParams } from "react-router-dom";
import "./YogaDetails.scss";
import { useState, useRef, useEffect } from "react";
import Navigation from "../../components/Navigation/Navigation";
import PlayButton from "../../assets/images/PlayButton.png";
import PauseButton from "../../assets/images/PauseButton.png";
import BackButton from "../../components/BackButton/BackButton";
import LikeButton from "../../components/LikeButton/LikeButton";
import { userState } from "../../state/userState";

const YogaDetails = () => {
    const [selectedVideo, setSelectedVideo] = useState([]);
    let { videoId } = useParams();
    const nav = useNavigate();
    const setUser = userState((state) => state.setUser);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    import.meta.env.VITE_BACKEND +
                        import.meta.env.VITE_API_VERSION +
                        "/data/videos/" +
                        videoId,
                    { credentials: "include" }
                );
                if (response.ok) {
                    const data = await response.json();
                    setSelectedVideo(data);
                } else {
                    const result = response.json();
                    setUser(result);
                    nav("/login");
                    throw new Error("Error fetching video");
                }
            } catch (error) {
                console.error("Error fetching video:", error);
            }
        };

        fetchData();
    }, []);

    const videoRef = useRef(null);
    const buttonRef = useRef(null);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const handlePlayClick = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsButtonVisible(false);
                setIsVideoPlaying(true);
            } else {
                videoRef.current.pause();
                setIsVideoPlaying(false);
            }
        }
    };

    const handleVideoClick = (event) => {
        if (videoRef.current && !videoRef.current.paused) {
            setIsButtonVisible(true);
        }
    };

    const addFavorite = async (video) => {
        try {
            const response = await fetch(
                import.meta.env.VITE_BACKEND +
                    import.meta.env.VITE_API_VERSION +
                    "/user/addYogaFav",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ favorite: video }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                console.log("favorite saved");
            } else {
                const result = response.json();
                throw new Error("Error saving favorite: " + result);
            }
        } catch (error) {
            console.error("Error saving favorite:", error);
        }
    };

    return (
        <section id="yogaDetails">
            <BackButton addClass="fill" />
            <button
                className="likeButton"
                onClick={() => addFavorite(selectedVideo)}
            ></button>
            <article className="yogaVideo">
                {selectedVideo.url && (
                    <video
                        controls={false}
                        ref={videoRef}
                        onClick={handleVideoClick}
                    >
                        <source src={selectedVideo.url} />
                    </video>
                )}

                {isButtonVisible && (
                    <button ref={buttonRef} onClick={handlePlayClick}>
                        {isVideoPlaying ? (
                            <img src={PauseButton} alt="pause" />
                        ) : (
                            <img src={PlayButton} alt="play" />
                        )}
                    </button>
                )}
            </article>
            <article className="yogaDetails">
                <h1 className="heading1">{selectedVideo.title}</h1>
                <p className="textSmall uppercase">{selectedVideo.level}</p>
                <p className="textSmall">{selectedVideo.description}</p>
                <div>
                    <p className="textSmall yogaFavoritesAndViews yogaFavorites">
                        {(selectedVideo.favorites / 1000).toFixed(3)} Favorites
                    </p>
                    <p className="textSmall yogaFavoritesAndViews yogaViews">
                        {(selectedVideo.views / 1000).toFixed(3)} Views
                    </p>
                </div>
            </article>
            <Navigation />
        </section>
    );
};

export default YogaDetails;
