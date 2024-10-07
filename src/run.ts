import { createBatterySensors } from "./create-battery-sensors.js";
import { listenForScreenOffMessage } from "./listen-for-screen-off-message.js";
import { listenForShutdownMessage } from "./listen-for-shutdown-message.js";
import { MqttConnection } from "./mqtt-connection.js";

const username = process.env["HASS_USERNAME"];
const password = process.env["HASS_PASSWORD"];
const host = "homeassistant.local";
const port = 1883;

const updateInterval = 1_000;

const client = new MqttConnection({
  host,
  username,
  password,
  port,
});

await client.connect();

createBatterySensors(client, updateInterval);
listenForShutdownMessage(client, "bens_imac/commands/shutdown");
listenForScreenOffMessage(client, "bens_imac/commands/screen_off");
