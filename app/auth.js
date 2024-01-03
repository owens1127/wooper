import { cookies } from "next/headers";

export function isAuthed() {
  const cookieStore = cookies();
  const cookie = cookieStore.get("wooper-secure");
  return cookie?.value === process.env.SECRET_KEY;
}
