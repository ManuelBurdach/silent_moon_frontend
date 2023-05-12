import { useNavigate } from "react-router-dom";
import "./LikeButton.scss";
import { userState } from "../../state/userState";

const LikeButton = ({ selectedVideo }) => {
  const nav = useNavigate();
  const setUser = userState((state) => state.setUser);

  const addFav = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND + import.meta.env.VITE_API_VERSION + "/user/addYogaFav",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedVideo),
        }
      );
      if (response.ok) {
        const data = await response.json();
      } else {
        const result = response.json();
        setUser(result);
        nav("/login");
        throw new Error("Error add favorite");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };
  return <button id="likeButton" onClick={addFav}></button>;
};

export default LikeButton;
