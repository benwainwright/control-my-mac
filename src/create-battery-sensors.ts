import { generateUniqueId } from "./generate-unique-id.js";
import { MqttSensor } from "./mqtt-sensor.js";
import { MqttConnection } from "./mqtt-connection.js";
import { System } from "./types/system.js";

const defaultBatterySensorConfig = {
  deviceClass: "battery",
  discoveryPrefix: "homeassistant",
  context: "bens_imac",
  unitOfMeasurement: "%",
};

export const createBatterySensors = (
  client: MqttConnection,
  system: System,
  pushInterval: number
) => {
  const sensors: MqttSensor[] = [];

  setInterval(async () => {
    const batteryLevels = await system.getBluetoothDevicesBatteryLevels().catch(
      (error: unknown) => {
        console.error("Failed to read Bluetooth battery levels", error);
        return [];
      }
    );

    batteryLevels.forEach((device) => {
      const uniqueId = generateUniqueId(
        device.deviceId
      );

      const existing = sensors.find((sensor) => sensor.uniqueId === uniqueId);
      if (!existing) {
        sensors.push(
          new MqttSensor(client, {
            ...defaultBatterySensorConfig,
            uniqueId,
            friendlyName: device.deviceName,
          })
        );
        return;
      }
      existing.state = String(device.percent);
    });
  }, pushInterval);
};
