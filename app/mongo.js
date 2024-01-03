const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@wooper.tzmgz4c.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function saveWooper(day, data) {
  await client
    .db("wooper")
    .collection("accounts")
    .updateOne(
      {
        day: day,
      },
      { $set: { data: data, day: day.toLowerCase() } },
      { upsert: true }
    );
}

export async function getWooperData(day) {
  const result = await client
    .db("wooper")
    .collection("accounts")
    .findOne({ day: day.toLowerCase() })
    .then((doc) =>
      doc
        ? {
            user: doc.data.member,
            clan: doc.data.group,
          }
        : null
    );
  return result;
}

export async function deleteWooperData(day) {
  await client
    .db("wooper")
    .collection("accounts")
    .deleteOne({ day: day.toLowerCase() });
}

export async function getWooperAccount(day) {
  const result = await client
    .db("wooper")
    .collection("accounts")
    .findOne({ day: day.toLowerCase() });
  return result?.data ?? null;
}
