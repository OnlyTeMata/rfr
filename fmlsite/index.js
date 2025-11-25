const express = require("express");
const next = require("next");
const https = require("https");
const fs = require("fs");
const { MongoClient } = require("mongodb");
const { Client, GatewayIntentBits, Partials } = require("discord.js");

const port = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const privateKey = fs.readFileSync(
  __dirname + "\\certificate\\private.key",
  "utf8"
);
const certificate = fs.readFileSync(
  __dirname +  "\\certificate\\certificate.crt",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };

let cachedDb = null;

async function connectToDatabase() {
  const uri =
    "mongodb://127.0.0.1:27017/fml?directConnection=true&serverSelectionTimeoutMS=2000";
  const client = new MongoClient(uri);

  try {
    await client.connect();
   /*  console.log("Connected to MongoDB (API)"); */
    cachedDb = client.db();
    return cachedDb;
  } catch (err) {
    console.error("Could not connect to MongoDB (API)", err);
    throw err;
  }
}

async function getDatabase() {
  return cachedDb || connectToDatabase();
}

async function getCollection(collectionName) {
  const db = await getDatabase();
  return db.collection(collectionName);
}

async function getUserAvatarAndName(userId) {
  try {
    const user = await client.users.fetch(userId);
    if (user) {
      return {
        avatar: user.displayAvatarURL({ size: 512, forceStatic: false }),
        username: user.username,
      };
    }
  } catch (e) {
    console.error("Error fetching user from Discord:", e);
  }

  const collection = await getCollection("users");
  const userFromDb = await collection.findOne({ Discord: userId });

  if (userFromDb) {
    return {
      avatar: userFromDb.DAvatar,
      username: userFromDb.DName,
    };
  }

  return {};
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.GuildMember, Partials.Message, Partials.User, Partials.Channel],
});

client.on("ready", () => {
  console.log("Bot is ready");
});

app.prepare().then(() => {
  const server = express();

  server.get("/api/v1/user/:id", async (req, res) => {
    const { id } = req.params;
    const user = await getUserAvatarAndName(id);
    res.send(user);
  });

  server.all("*", (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`HTTP: Running on port ${port}, dev: ${dev}`);
  });

  https.createServer(credentials, server).listen(443, (err) => {
    if (err) throw err;
    console.log(`HTTPS: Running on port 443`);
  });
});

client.login(process.env.BOT_TOKEN);
