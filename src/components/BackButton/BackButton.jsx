import { useNavigate } from "react-router-dom";
import "./BackButton.scss";
import BackButtonImage from "../../assets/images/BackButton.png";

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)}>
            {" "}
            <img src={BackButtonImage} alt="arrow back" />{" "}
        </button>
    );
};

export default BackButton;
