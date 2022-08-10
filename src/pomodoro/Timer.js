import React from "react";
import { minutesToDuration } from "../utils/duration";

const Timer = ({ timerName, timer, decreaseTimer, increaseTimer }) => {
  return (
    <div className="col" style={{ minWidth: "fit-content" }}>
      <div className={timerName === "Break" ? "float-right" : ""}>
        <div
          className="input-group input-group-lg mb-2"
          style={{
            outline: "3px solid red",
            width: "fit-content",
            borderRadius: "5px",
          }}
        >
          <span
            className="input-group-text"
            data-testid={`duration-${timerName.toLowerCase()}`}
          >
            <strong>
              {timerName} Duration: {minutesToDuration(timer)}
            </strong>
          </span>
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-secondary"
              data-testid={`decrease-${timerName.toLowerCase()}`}
              onClick={decreaseTimer}
            >
              <span className="oi oi-minus" />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-testid={`increase-${timerName.toLowerCase()}`}
              onClick={increaseTimer}
            >
              <span className="oi oi-plus" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
