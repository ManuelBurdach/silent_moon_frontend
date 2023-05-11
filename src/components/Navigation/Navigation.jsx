import "./Navigation.scss";
import { Link } from "react-router-dom";

import Yoga from "../../assets/images/NavYoga.png";
import Meditate from "../../assets/images/NavMeditate.png";
import Home from "../../assets/images/NavHome.png";
import Music from "../../assets/images/NavMusic.png";
import Profile from "../../assets/images/NavProfile.png";

const Navigation = () => {
    return (
        <article id="navigation">
            <Link to="/yoga">
                <img src={Yoga} alt="Yoga button" />
                <p className="textSmall">Yoga</p>
            </Link>
            <div>
                <img src={Meditate} alt="Meditate button" />
                <p className="textSmall">Meditate</p>
            </div>
            <Link to="/home">
                <img src={Home} alt="Home button" />
                <p className="textSmall">Home</p>
            </Link>
            <div>
                <img src={Music} alt="Music button" />
                <p className="textSmall">Music</p>
            </div>
            <div>
                <img src={Profile} alt="Profile button" />
                <p className="textSmall">Profile</p>
            </div>
        </article>
    );
};

export default Navigation;
