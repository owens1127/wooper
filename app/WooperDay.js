import Link from "next/link";
import { getWooperData } from "./mongo";
import { isAuthed } from "./auth";

export async function WooperDay(props) {
  const data = await getWooperData(props.day);

  return (
    <div style={{ color: "white" }}>
      <h2>{props.day}</h2>
      {data ? (
        <div>
          <h3>{data.user.destinyUserInfo.bungieGlobalDisplayName}</h3>
          <h4>{data.clan.name}</h4>
        </div>
      ) : (
        <h3>Not Authorized</h3>
      )}
      {isAuthed() && (
        <div>
          <Link
            href={`https://www.bungie.net/en/oauth/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&state=${props.day}&reauth=true`}
          >
            <button>Authorize</button>
          </Link>
          <Link href={`/api/remove?day=${props.day}`}>
            <button style={{ backgroundColor: "#ff7d7d" }}>Unauthorize</button>
          </Link>
        </div>
      )}
    </div>
  );
}
