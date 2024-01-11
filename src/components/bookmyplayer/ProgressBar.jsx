import React from "react";
import { Doughnut } from "react-chartjs-2";

const ProgressBar = ({ array }) => {
    function countElements() {
        const elementsToCheck = ["1", "2", "3", "4"];
        const count = elementsToCheck?.filter((element) => array?.includes(element))?.length;
        return count;
    }
    const elementsCount = countElements();
    const progress = (elementsCount / 4) * 100;

    const data = {
        datasets: [
            {
                data: [progress, 100 - progress],
                backgroundColor: ["#007bff", "#d3d3d3"],
                hoverBackgroundColor: ["#0056b3", "#d3d3d3"],
                borderWidth: 0,
            },
        ],
    };
    const options = {
        cutout: "85%",
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        tooltip: {
            enabled: false,
        },
    };

    return (
        <>
            <div className="bmp-top-right">
                <div className="status-of-profile">
                    <p className="common-fonts">Update Profile</p>
                    <div className="progress-bar">
                        <div
                            className={`bmp-small-circle ${array?.includes("1") ? "bmp-completed-stage" : ""
                                }`}
                        >
                            1
                        </div>
                        <div className="bmp-line"></div>
                        <div
                            className={`bmp-small-circle ${array?.includes("2") ? "bmp-completed-stage" : ""
                                }`}
                        >
                            2
                        </div>
                        <div className="bmp-line"></div>
                        <div
                            className={`bmp-small-circle ${array?.includes("3") ? "bmp-completed-stage" : ""
                                }`}
                        >
                            3
                        </div>
                        <div className="bmp-line"></div>
                        <div
                            className={`bmp-small-circle ${array?.includes("4") ? "bmp-completed-stage" : ""
                                }`}
                        >
                            4
                        </div>
                    </div>
                </div>

                <div className="bmp-msg">
                    <p className="common-fonts bmp-now ">Profile Complete</p>
                    <div className="bmp-circle">
                        <Doughnut data={data} options={options} />
                        <div className="circle-percentage">
                            <span className="common-fonts percentage-value">{`${progress}%`}</span>
                        </div>
                    </div>
                    <button className="common-fonts bmp-complete-btn">Complete Now</button>
                </div>
            </div>
        </>
    );
};

export default ProgressBar;
