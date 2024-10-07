import { generateUniqueId } from "./generate-unique-id.js";
import { getItemsWithBatteryFromIoreg } from "./get-items-with-battery-from-ioreg.js";
import { MqttSensor } from "./mqtt-sensor.js";
import { MqttConnection } from "./mqtt-connection.js";

const defaultBatterySensorConfig = {
  deviceClass: "battery",
  discoveryPrefix: "homeassistant",
  context: "bens_imac",
  unitOfMeasurement: "%",
};

export const createBatterySensors = (
  client: MqttConnection,
  pushInterval: number
) => {
  const sensors: MqttSensor[] = [];

  setInterval(async () => {
    const response = await getItemsWithBatteryFromIoreg();
    response.forEach((device) => {
      const uniqueId = generateUniqueId(
        `${device.Product}_${device.DeviceAddress}`
      );

      const friendlyName = `${device.Product} battery`;

      const existing = sensors.find((sensor) => sensor.uniqueId === uniqueId);
      if (!existing) {
        sensors.push(
          new MqttSensor(client, {
            ...defaultBatterySensorConfig,
            uniqueId,
            friendlyName,
          })
        );
        return;
      }
      existing.state = String(device.BatteryPercent);
    });
  }, pushInterval);
};
