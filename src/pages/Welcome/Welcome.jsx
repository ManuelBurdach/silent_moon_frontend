import WelcomeImage from "../../assets/images/Welcome.png";
import "./Welcome.scss";
import { Link } from "react-router-dom";

const Welcome = () => {
    return (
        <section className="welcome">
            <p className="logo light">SILENT MOON</p>
            <img src={WelcomeImage} alt="" />
            <h1>Hi Leon, welcome to Silent Moon</h1>
            <Link to="/" className="bigRedButton">
                Get Started
            </Link>
        </section>
    );
};

export default Welcome;
