import { getItemsWithBatteryFromIoreg } from "./get-items-with-battery-from-ioreg";
import mqtt from "mqtt";
import { MqttSensor } from "./mqtt-sensor";

const username = process.env["HASS_USERNAME"];
const password = process.env["HASS_PASSWORD"];
const host = "homeassistant.local";
const port = 1883;

const interval = 1_000;

const client = mqtt.connect({
  host: "homeassistant.local",
  username,
  password,
  port,
});

client.on("error", (message) => {
  console.log(message);
});

const sensors: MqttSensor[] = [];

client.on("connect", () => {
  console.log(`Connected to mosquito on ${host}${port}`);

  setInterval(async () => {
    const response = await getItemsWithBatteryFromIoreg();
    response
      .map((device) => ({
        product: device.Product as string,
        mac: device.DeviceAddress as string,
        serial: device.SerialNumber as string,
        battery: device.BatteryPercent as number,
      }))
      .forEach((device) => {
        const id = `${device.product}_${device.mac}`
          .replace(/[-\s]/g, "_")
          .toLocaleLowerCase();

        console.log(id);

        const existing = sensors.find((sensor) => sensor.uniqueId === id);
        if (!existing) {
          sensors.push(
            new MqttSensor(client, {
              uniqueId: id,
              deviceClass: "battery",
              discoveryPrefix: "homeassistant",
              context: "bens_imac",
              unitOfMeasurement: "%",
              friendlyName: `${device.product} battery`,
            })
          );
        }
        existing?.setState(device.battery);
      });
  }, interval);
});
