import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./RandomHome.scss";

const RandomHome = ({ videos, playlists }) => {
    const [randomVideo, setRandomVideo] = useState();
    const [randomMeditation, setRandomMeditation] = useState();
    const [isLoading, setIsLoading] = useState(true);

    console.log(randomVideo);
    console.log(randomMeditation);
    useEffect(() => {
        // Fourth useEffect: Select random video and meditation
        const randomIndex = Math.floor(Math.random() * videos.length);
        setRandomVideo(videos[randomIndex]);

        const randomPlaylistIndex = Math.floor(
            Math.random() * playlists.length
        );
        setRandomMeditation(playlists[randomPlaylistIndex]);

        setIsLoading(false);
    }, [videos, playlists]);

    if (isLoading) {
        return (
            <div className="lds-ripple">
                <div></div>
                <div></div>
            </div>
        );
    }

    return (
        <article id="randomSuggestions">
            <div>
                <Link
                    to={`/meditatedetails/${randomMeditation.id}`}
                    key={randomMeditation.id}
                >
                    <img src={randomMeditation.images[0].url} alt="" />

                    <h3 className="heading2">{randomMeditation.name}</h3>

                    <p className="textSmall uppercase">playlist</p>
                    <p className="textSmall uppercase">
                        {randomMeditation.tracks.total} items
                    </p>
                    <p className="textSmall uppercase">Start</p>
                </Link>
            </div>
            <div>
                <Link
                    to={`/yogadetails/${randomVideo._id}`}
                    key={randomVideo._id}
                >
                    <video controls={false}>
                        <source src={randomVideo.url} />
                    </video>

                    <h3 className="heading2">{randomVideo.title}</h3>

                    <p className="textSmall uppercase">{randomVideo.level}</p>
                    <p className="textSmall uppercase">
                        {randomVideo.duration} min
                    </p>
                    <p className="textSmall uppercase">Start</p>
                </Link>
            </div>
        </article>
    );
};

export default RandomHome;
