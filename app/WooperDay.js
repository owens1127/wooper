import Link from "next/link";
import { deleteWooperData, getWooperData } from "./api/mongo";
import { isAuthed } from "./auth";
import { invite } from "./api/invite";
import { revalidatePath } from "next/cache";
import ImperativeServerAction from "./serverAction";

export async function WooperDay(props) {
  const data = await getWooperData(props.day);

  async function inviteAction() {
    "use server";

    await invite(props.day);
  }

  async function removeAction() {
    "use server";

    await deleteWooperData(props.day).then(() => revalidatePath("/"));
  }

  return (
    <div style={{ color: "white" }}>
      <h2>{props.day}</h2>
      {data ? (
        <div>
          <h3>{data.user?.destinyUserInfo.bungieGlobalDisplayName}</h3>
          <h4>{data.clan?.name}</h4>
        </div>
      ) : (
        <h3>Not Authorized</h3>
      )}
      {isAuthed() && (
        <div>
          {data ? (
            <>
              <ImperativeServerAction
                title="Send Invite"
                action={inviteAction}
              />
              <ImperativeServerAction
                style={{ backgroundColor: "#ff7d7d" }}
                title="Unauthorize"
                action={removeAction}
              />
            </>
          ) : (
            <Link
              href={`https://www.bungie.net/en/oauth/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&state=${props.day}&reauth=true`}
            >
              <button>Authorize</button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
