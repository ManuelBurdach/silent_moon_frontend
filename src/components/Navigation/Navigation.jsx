import { userState } from "../../state/userState";
import "./Navigation.scss";
import { NavLink } from "react-router-dom";

const Navigation = () => {
    const user = userState((state) => state.user);
    return (
        <article id="navigation">
            <NavLink to="/yoga" activeclassname="active">
                <p className="textSmall">Yoga</p>
            </NavLink>
            <NavLink to="/meditate" activeclassname="active">
                <p className="textSmall">Meditate</p>
            </NavLink>
            <NavLink to="/home" activeclassname="active">
                <p className="textSmall">Home</p>
            </NavLink>
            <NavLink to="/music" activeclassname="active">
                <p className="textSmall">Music</p>
            </NavLink>
            <NavLink to="/" activeclassname="active">
                <p className="textSmall">
                    {user.firstName.charAt(0).toUpperCase() +
                        user.firstName.slice(1)}
                </p>
            </NavLink>
        </article>
    );
};

export default Navigation;
