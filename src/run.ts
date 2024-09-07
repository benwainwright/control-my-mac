import { createBatterySensors } from "./create-battery-sensors.js";
import { listenForShutdownMessage } from "./listen-for-shutdown-message.js";
import { Mqtt } from "./mqtt.js";

const username = process.env["HASS_USERNAME"];
const password = process.env["HASS_PASSWORD"];
const host = "homeassistant.local";
const port = 1883;

const updateInterval = 1_000;

const client = new Mqtt({
  host,
  username,
  password,
  port,
});

await client.connect();

createBatterySensors(client, updateInterval);
listenForShutdownMessage(client, "bens_imac/commands/shutdown");
