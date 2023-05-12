import { useRef, useState } from "react";
import { userState } from "../../state/userState";
import "./Reminder.scss";
import { Link } from "react-router-dom";

const Reminder = () => {
  const time = useRef();
  const [SU, toggleSU] = useState(false);
  const [M, toggleM] = useState(true);
  const [T, toggleT] = useState(false);
  const [W, toggleW] = useState(true);
  const [TH, toggleTH] = useState(false);
  const [F, toggleF] = useState(true);
  const [S, toggleS] = useState(false);

  const user = userState((state) => state.user);

  const saveReminders = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND + import.meta.env.VITE_API_VERSION + "/user/addReminders",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ time: time, su: SU, m: M, t: T, w: W, th: TH, f: F, s: S }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedVideo(data);
      } else {
        const result = response.json();
        setUser(result);
        nav("/login");
        throw new Error("Error fetching video");
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  return (
    <section className="reminder">
      <p className="logo">SILENT MOON</p>
      <h2>What time would you like to meditate?</h2>
      <p className="p_grey">Any time you can choose but We recommend first thing in th morning.</p>
      <form>
        <input type="time" defaultValue={"12:00"} />
        <select name="" id="">
          <option value="am">Am</option>
          <option value="pm">Pm</option>
        </select>
      </form>
      <h2>Which day would you like to meditate?</h2>
      <p className="p_grey">Everyday is best, but we recommend picking at least five.</p>
      <div>
        <button
          onClick={() => {
            toggleSU(!SU);
          }}
          className={SU ? "day_active" : "day"}
        >
          SU
        </button>
        <button
          onClick={() => {
            toggleM(!M);
          }}
          className={M ? "day_active" : "day"}
        >
          M
        </button>
        <button
          onClick={() => {
            toggleT(!T);
          }}
          className={T ? "day_active" : "day"}
        >
          T
        </button>
        <button
          onClick={() => {
            toggleW(!W);
          }}
          className={W ? "day_active" : "day"}
        >
          W
        </button>
        <button
          onClick={() => {
            toggleTH(!TH);
          }}
          className={TH ? "day_active" : "day"}
        >
          TH
        </button>
        <button
          onClick={() => {
            toggleF(!F);
          }}
          className={F ? "day_active" : "day"}
        >
          F
        </button>
        <button
          onClick={() => {
            toggleS(!S);
          }}
          className={S ? "day_active" : "day"}
        >
          S
        </button>
      </div>

      <div className="flex">
        <Link onClick={saveReminders} className="m5 bigRedButton">
          SAVE
        </Link>
        <Link to="/home" style={{ color: "#e28f83" }}>
          NO THANKS
        </Link>
      </div>
    </section>
  );
};

export default Reminder;
