import WelcomeImage from "../../assets/images/Welcome.png";
import { userState } from "../../state/userState";
import "./Welcome.scss";
import { Link } from "react-router-dom";

const Welcome = () => {
  const user = userState((state) => state.user);
  return (
    <section className="welcome">
      <p className="logo light">SILENT MOON</p>
      <img src={WelcomeImage} alt="" />
      <h1>Hi {user.firstName}, welcome to Silent Moon</h1>
      <Link to="/" className="bigRedButton">
        Get Started
      </Link>
    </section>
  );
};

export default Welcome;
