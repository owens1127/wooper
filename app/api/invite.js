import { getWooperAccount, saveWooper } from "@/app/api/mongo";

export async function invite(day) {
  const msg = `Attention it is now Wooper ${day}`;
  console.log(msg);

  const account = await reauth(day.toLowerCase());

  const res = await fetch(
    `https://www.bungie.net/Platform/GroupV2/${account.group.groupId}/Members/IndividualInvite/${process.env.MEMBERSHIP_TYPE}/${process.env.MEMBERSHIP_ID}/`,
    {
      method: "POST",
      headers: {
        "X-API-Key": process.env.API_KEY,
        Authorization: `Bearer ${account.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: msg,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error(err);
    console.error("Failed to send clan invite");
    throw new Error(err);
  } else {
    const body = await res.json();
    console.log(body.ErrorStatus);
  }
}

async function reauth(day) {
  const json = await getWooperAccount(day);

  const res = await fetch("https://www.bungie.net/platform/app/oauth/token/", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.API_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      refresh_token: json.refresh_token,
      grant_type: "refresh_token",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(err);
    throw Error("Failed to refresh access token");
  }

  const body = await res.json();

  const account = {
    ...json,
    access_token: body.access_token,
    refresh_token: body.refresh_token,
    expires_at: Date.now() + body.expires_in * 1000,
    refresh_expires_at: Date.now() + body.refresh_expires_in * 1000,
  };
  saveWooper(day, account);

  return account;
}
