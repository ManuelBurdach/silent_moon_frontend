import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DefaultResult from "../../assets/images/DefaultResult.png";
import "./UserProfile.scss";
import { userState } from "../../state/userState";
import Navigation from "../../components/Navigation/Navigation";

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

const UserProfile = () => {
    const [favoritePlaylists, setFavoritePlaylists] = useState([]);
    const [favoriteVideos, setFavoriteVideos] = useState([]);
    const [accessToken, setAccessToken] = useState("");
    const [playlists, setPlaylists] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const user = userState((state) => state.user);

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
            });
    }, []);

    useEffect(() => {
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
                setPlaylists(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching playlists:", error);
            });
    }, [accessToken]);

    console.log(isLoading);

    if (isLoading) {
        <div className="lds-ripple">
            <div></div>
            <div></div>
        </div>;
    }

    return (
        <section id="userProfile">
            <h4 className="logo">SILENT MOON</h4>

            <article id="userProfileHeader">
                <h1 className="heading1">Hi {user.firstName}!</h1>
                <p className="textSmall">Find your favorite content here. </p>
            </article>
            <form>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>
            <article className="homeVideos">
                <h2 className="heading2">Your Favorite Yoga Sessions</h2>
                <div>
                    {favoriteVideos
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
                    {favoriteVideos.filter((video) =>
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
                <h2 className="heading2">Your Favorite Meditations</h2>
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

export default UserProfile;
