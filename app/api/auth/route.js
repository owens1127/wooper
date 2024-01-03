import { saveWooper } from "@/app/mongo";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export async function GET(request) {
  const host = process.env.VERCEL_URL ?? new URL("/", request.url);

  try {
    const params = request.nextUrl.searchParams;
    const state = params.get("state").toLowerCase();
    const cookieStore = cookies();

    if (state !== "admin") {
      if (
        cookieStore.get("wooper-secure").value !== process.env.SECRET_KEY ||
        !days.includes(state)
      ) {
        return NextResponse.redirect(host + "?error=" + "Unauthorized");
      }
    }

    const data = await fetch(
      "https://www.bungie.net/platform/app/oauth/token/",
      {
        method: "POST",
        headers: {
          "X-API-Key": process.env.API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: params.get("code"),
          grant_type: "authorization_code",
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
        }),
      }
    );

    if (!data.ok) {
      const err = await data.text();
      console.log(err);
      console.error("Failed to get access token");

      return NextResponse.redirect(host + "?error=" + encodeURIComponent(err));
    }

    const body = await data.json();

    const clan = await fetch(
      `https://www.bungie.net/Platform/GroupV2/User/254/${body.membership_id}/0/1/`,
      {
        headers: {
          "X-API-Key": process.env.API_KEY,
        },
      }
    )
      .then((data) => data.json())
      .then((json) => json.Response.results[0]);

    if (days.includes(state)) {
      await saveWooper(state, {
        ...body,
        expires_at: Date.now() + body.expires_in * 1000,
        refresh_expires_at: Date.now() + body.refresh_expires_in * 1000,
        ...clan,
      });

      console.log("Auth successful for", state);

      return NextResponse.redirect(host);
    } else if (state === "admin") {
      const res = NextResponse.redirect(host);
      res.cookies.set("wooper-secure", process.env.SECRET_KEY, {
        httpOnly: true,
        secure: true,
      });
      return res;
    }
  } catch (e) {
    return NextResponse.redirect(
      host + "?error=" + encodeURIComponent(e.message)
    );
  }
}
