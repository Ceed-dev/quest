"use client";

import { useEffect, useState, useCallback } from "react";

type CountdownTimerProps = {
  endTime: Date;
};

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const calculateTimeLeft = useCallback(() => {
    const difference = +endTime - +new Date();

    let timeLeft = {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };

    if (difference > 0) {
      timeLeft = {
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(
          2,
          "0",
        ),
        hours: String(
          Math.floor((difference / (1000 * 60 * 60)) % 24),
        ).padStart(2, "0"),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(
          2,
          "0",
        ),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
      };
    }

    return timeLeft;
  }, [endTime]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return (
    <div className="border-2 border-white rounded-md text-center p-6">
      <p className="font-bold text-sm mb-2 text-left">Time Remaining:</p>
      <div className="flex justify-center gap-6 text-center">
        {["days", "hours", "minutes", "seconds"].map((unit) => (
          <div key={unit}>
            <div className="text-2xl font-extrabold">
              {timeLeft[unit as keyof typeof timeLeft]}
            </div>
            <div className="text-sm font-bold">
              {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
