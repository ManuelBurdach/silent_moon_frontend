import "./Navigation.scss";
import { NavLink } from "react-router-dom";

const Navigation = () => {
    return (
        <article id="navigation">
            <NavLink to="/yoga" activeclassname="active">
                <p className="textSmall">Yoga</p>
            </NavLink>
            <NavLink to="/" activeclassname="active">
                <p className="textSmall">Meditate</p>
            </NavLink>
            <NavLink to="/home" activeclassname="active">
                <p className="textSmall">Home</p>
            </NavLink>
            <NavLink to="/music" activeclassname="active">
                <p className="textSmall">Music</p>
            </NavLink>
            <NavLink to="/" activeclassname="active">
                <p className="textSmall">Profile</p>
            </NavLink>
        </article>
    );
};

export default Navigation;
