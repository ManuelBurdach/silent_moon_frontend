import React, { useRef, useEffect, useState } from "react";
import "./TimePicker.scss";

const TimePicker = (props) => {
    const [selectedHour, setSelectedHour] = useState(null);
    const [selectedMinute, setSelectedMinute] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);

    useEffect(() => {
        const hourPicker = document.getElementById("hourPicker");
        const minutePicker = document.getElementById("minutePicker");
        const dayPicker = document.getElementById("dayPicker");

        const handleScroll = (event) => {
            const pickerId = event.target.id;
            const picker = event.target;
            const scrollTop = picker.scrollTop;
            const scrollItemHeight = picker.querySelector("li").offsetHeight;

            // Calculate the index of the selected item based on scroll position
            const selectedItemIndex =
                Math.round(scrollTop / scrollItemHeight) - 1;

            // Get the selected item value
            const selectedValue = picker.children[selectedItemIndex].innerText;

            // Update the respective state variable based on the pickerId
            switch (pickerId) {
                case "hourPicker":
                    setSelectedHour(selectedValue);
                    break;
                case "minutePicker":
                    setSelectedMinute(selectedValue);
                    break;
                case "dayPicker":
                    setSelectedPeriod(selectedValue);
                    break;
                default:
                    break;
            }
        };

        // Add scroll event listeners to each picker with the respective pickerId
        hourPicker.addEventListener("scroll", (event) =>
            handleScroll(event, "hourPicker")
        );
        minutePicker.addEventListener("scroll", (event) =>
            handleScroll(event, "minutePicker")
        );
        dayPicker.addEventListener("scroll", (event) =>
            handleScroll(event, "dayPicker")
        );

        return () => {
            // Clean up the event listeners when the component is unmounted
            hourPicker.removeEventListener("scroll", handleScroll);
            minutePicker.removeEventListener("scroll", handleScroll);
            dayPicker.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (
            selectedHour !== null &&
            selectedMinute !== null &&
            selectedPeriod !== null
        ) {
            const formattedTime = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
            props.onTimeSelection(formattedTime);
        }
    }, [selectedHour, selectedMinute, selectedPeriod]);

    return (
        <section id="timePicker">
            <div className="picker">
                <div className="picker-window"></div>
                <ul id="hourPicker" className="picker-hour">
                    {[...Array(12)].map((_, index) => (
                        <li key={index}>{index + 1}</li>
                    ))}
                </ul>

                <ul id="minutePicker" className="picker-minute">
                    {[...Array(12)].map((_, index) => (
                        <li key={index}>
                            {String(index * 5).padStart(2, "0")}
                        </li>
                    ))}
                </ul>

                <ul id="dayPicker" className="picker-day">
                    <li>am</li>
                    <li>pm</li>
                </ul>
            </div>
        </section>
    );
};

export default TimePicker;
