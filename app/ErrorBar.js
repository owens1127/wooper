"use client";

import { useSearchParams } from "next/navigation";

export async function ErrorBar() {
  const searchParams = useSearchParams();
  const err = searchParams.get("error");

  return err && <h2 style={{ color: "red" }}>{err}</h2>;
}
