import { createBatterySensors } from "./create-battery-sensors.js";
import { getSystem } from "./get-system.js";
import { MqttConnection } from "./mqtt-connection.js";

const namespace = process.env["HASS_INSTANCE_NAMESPACE"];
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

const system = getSystem();

createBatterySensors(client, system, updateInterval);

client.subscribe(`${namespace}/commands/shutdown`, async () => {
  await system.shutdown();
});

client.subscribe(`${namespace}/commands/screen_off`, async () => {
  await system.turnoffScreen();
});
