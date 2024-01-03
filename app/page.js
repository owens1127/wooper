import { Suspense } from "react";
import { WooperDay } from "./WooperDay";
import { isAuthed } from "./auth";
import Link from "next/link";
import { ErrorBar } from "./ErrorBar";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function Home() {
  return (
    <main
      style={{
        padding: "1em",
      }}
    >
      <ErrorBar />
      <h1 style={{ color: "white" }}>Welcome Woopers</h1>
      {!isAuthed() && (
        <h3>
          <Link
            style={{ color: "pink" }}
            href={`https://www.bungie.net/en/oauth/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&state=admin&reauth=true`}
          >
            Log In
          </Link>
        </h3>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "1em",
          justifyContent: "center",
        }}
      >
        {days.map((day) => (
          <Suspense
            key={day}
            fallback={<div style={{ color: "white" }}>Loading...</div>}
          >
            <WooperDay day={day} />
          </Suspense>
        ))}
      </div>
    </main>
  );
}
