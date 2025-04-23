"use client";

import { useEffect, useState } from "react";

export function CountdownTimer({ endTime }: { endTime: string }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(endTime) - +new Date();
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
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="border-2 border-black rounded-md text-center p-6">
      <p className="font-bold text-sm mb-2 text-left">Lucky Draw in:</p>
      <div className="flex justify-center gap-6 text-center">
        <div>
          <div className="text-2xl font-extrabold">{timeLeft.days}</div>
          <div className="text-sm font-bold">Days</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold">{timeLeft.hours}</div>
          <div className="text-sm font-bold">Hours</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold">{timeLeft.minutes}</div>
          <div className="text-sm font-bold">Minutes</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold">{timeLeft.seconds}</div>
          <div className="text-sm font-bold">Seconds</div>
        </div>
      </div>
    </div>
  );
}
