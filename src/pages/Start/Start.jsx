import StartImage from "../../assets/images/Start.png";
import "./Start.scss";
import { Link } from "react-router-dom";

const Start = () => {
    return (
        <section className="start">
            <p className="logo">SILENT MOON</p>
            <img src={StartImage} alt="a man doing a handstand" />
            <article>
                <h1>We are what we do</h1>
                <p className="textSmall">
                    Thousand of people are using silent moon for meditation and
                    yoga classes.
                </p>
                <Link to="/register" className="bigRedButton">
                    Sign up
                </Link>
                <p className="textSmall uppercase">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </article>
        </section>
    );
};

export default Start;
