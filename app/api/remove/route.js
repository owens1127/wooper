import { deleteWooperData } from "@/app/mongo";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function GET(request) {
  const host = process.env.VERCEL_URL ?? "http://localhost:3000";
  const params = request.nextUrl.searchParams;

  const cookieStore = cookies();
  if (cookieStore.get("wooper-secure").value !== process.env.SECRET_KEY) {
    return NextResponse.redirect(host + "?error=" + "Unauthorized");
  }

  try {
    await deleteWooperData(params.get("day"));
    revalidatePath("/");
    return NextResponse.redirect(host);
  } catch (e) {
    return NextResponse.redirect(host + "?error=" + e.message);
  }
}