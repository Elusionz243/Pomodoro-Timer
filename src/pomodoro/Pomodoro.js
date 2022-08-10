import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import Timer from "./Timer";
import { secondsToDuration, minutesToDuration } from "../utils/duration";

import "./Pomodoro.css";

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [firstPlay, setFirstPlay] = useState(true);
  const [onBreak, setOnBreak] = useState(false);
  const [activeSession, setActiveSession] = useState(false);

  const [focusTimer, setFocusTimer] = useState(25);
  const [breakTimer, setBreakTimer] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [initialBreakTimer, setInitialBreakTimer] = useState(5);
  const [initialFocusTimer, setInitialFocusTimer] = useState(25);

  const [durationProgress, setDurationProgress] = useState(0);

  const increaseFocusTimer = () =>
    setFocusTimer((currentTime) =>
      currentTime !== 60 ? currentTime + 5 : currentTime
    );
  const decreaseFocusTimer = () =>
    setFocusTimer((currentTime) =>
      currentTime !== 5 ? currentTime - 5 : currentTime
    );
  const increaseBreakTimer = () =>
    setBreakTimer((currentTime) =>
      currentTime !== 15 ? currentTime + 1 : currentTime
    );
  const decreaseBreakTimer = () =>
    setBreakTimer((currentTime) =>
      currentTime !== 1 ? currentTime - 1 : currentTime
    );

  const percentage = (currentMinutes, currentSeconds, initialMinutes) => {
    return (
      100 -
      ((currentMinutes * 60 + currentSeconds) / (initialMinutes * 60)) * 100
    );
  };

  useInterval(
    () => {
      setDurationSeconds((second) => {
        second === 0 ? (second = 59) : second--;
        if (second === 59) setDurationMinutes((minutes) => (minutes -= 1));
        return second;
      });

      if (onBreak)
        setDurationProgress(
          (currentProgress) =>
            (currentProgress = percentage(
              durationMinutes,
              durationSeconds,
              initialBreakTimer
            ))
        );
      else
        setDurationProgress(
          (currentProgress) =>
            (currentProgress = percentage(
              durationMinutes,
              durationSeconds,
              initialFocusTimer
            ))
        );

      if (durationMinutes === 0 && durationSeconds === 1) timerExpired();
    },
    isTimerRunning ? 1000 : null
  );

  const timerExpired = () =>
    !onBreak ? focusTimerExpired() : breakTimerExpired();

  const breakTimerExpired = () => {
    new Audio("https://bigsoundbank.com/UPLOAD/mp3/0899.mp3").play();
    setOnBreak((state) => (state = false));
    setDurationProgress((progress) => (progress = 0));
    setDurationSeconds((second) => (second = 0));
    setDurationMinutes((minutes) => (minutes = initialFocusTimer));
  };

  const focusTimerExpired = () => {
    new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
    setOnBreak((state) => (state = true));
    setDurationProgress((duration) => (duration = 0));
    setDurationSeconds((second) => (second = 0));
    setDurationMinutes((minute) => (minute = breakTimer));
  };

  const playPause = () => {
    if (firstPlay) {
      setInitialFocusTimer((duration) => (duration = focusTimer));
      setInitialBreakTimer((duration) => (duration = breakTimer));
      setDurationMinutes((duration) => (duration = focusTimer));
      setFirstPlay((first) => (first = false));
    }
    setActiveSession((session) => (session = true));
    setIsTimerRunning((prevState) => !prevState);
  };

  const stopBtn = () => {
    setFirstPlay((state) => (state = true));
    setIsTimerRunning((timer) => (timer = false));
    setOnBreak((state) => (state = false));
    setActiveSession((session) => (session = false));

    setDurationProgress((progress) => (progress = 0));
    setDurationSeconds((second) => (second = 0));
    setDurationMinutes((minute) => (minute = focusTimer));
    setInitialFocusTimer((duration) => (duration = focusTimer));
    setInitialBreakTimer((duration) => (duration = breakTimer));
  };

  const handleDisplay = activeSession
    ? { display: "block" }
    : { display: "none" };
  const handleSessionDuration = !onBreak
    ? minutesToDuration(initialFocusTimer)
    : minutesToDuration(initialBreakTimer);
  const handleSessionTitle = !onBreak ? "Focusing" : "On Break";

  return (
    <div className="pomodoro">
      <div className="row focus-duration">
        <Timer
          timerName={"Focus"}
          timer={focusTimer}
          decreaseTimer={decreaseFocusTimer}
          increaseTimer={increaseFocusTimer}
        />
        <Timer
          timerName={"Break"}
          timer={breakTimer}
          decreaseTimer={decreaseBreakTimer}
          increaseTimer={increaseBreakTimer}
        />
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
            style={{ border: "3px solid red", borderRadius: "10px" }}
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              title="Stop the session"
              onClick={stopBtn}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>
      <div style={handleDisplay}>
        <div className="row mb-2">
          <div className="col">
            <h2 data-testid="session-title" style={{ color: "lime" }}>
              {handleSessionTitle} for {handleSessionDuration} minutes
            </h2>
            <p className="lead" data-testid="session-sub-title">
              <strong style={{ color: "white" }}>
                {secondsToDuration(durationMinutes * 60 + durationSeconds)}{" "}
                remaining
              </strong>
            </p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={durationProgress}
                style={{ width: `${durationProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
