import { days } from "@/app/days";
import { NextResponse } from "next/server";
import { invite } from "../invite";

export async function GET(req) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  try {
    invite(days[new Date().getDay()]);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
