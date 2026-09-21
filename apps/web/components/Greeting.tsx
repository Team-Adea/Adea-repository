"use client";

import { useSyncExternalStore } from "react";

// The server doesn't know the visitor's time zone, so the greeting is worked out in the
// browser. The snapshot is "minutes since epoch": stable between renders, 0 on the server.
const subscribe = () => () => {};
const clientMinute = () => Math.floor(Date.now() / 60000);
const serverMinute = () => 0;

export default function Greeting({ name }: { name?: string }) {
  const minute = useSyncExternalStore(subscribe, clientMinute, serverMinute);

  let hello = "Hello";
  let date = "";
  if (minute) {
    const now = new Date(minute * 60000);
    const hour = now.getHours();
    hello = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    date = now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  }

  return (
    <div>
      <p className="dash-date">{date || " "}</p>
      <h1>{name ? `${hello}, ${name}` : hello}</h1>
    </div>
  );
}
