import { useNavigate } from "react-router-dom";
import "./BackButton.scss";

const BackButton = ({ addClass }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            id="backButton"
            className={addClass}
        ></button>
    );
};

export default BackButton;
