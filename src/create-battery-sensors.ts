import { generateUniqueId } from "./generate-unique-id.js";
import { getItemsWithBatteryFromIoreg } from "./get-items-with-battery-from-ioreg.js";
import { MqttSensor } from "./mqtt-sensor.js";
import { Mqtt } from "./mqtt.js";

export const createBatterySensors = (client: Mqtt, pushInterval: number) => {
  const sensors: MqttSensor[] = [];

  setInterval(async () => {
    const response = await getItemsWithBatteryFromIoreg();
    response.forEach((device) => {
      const id = generateUniqueId(`${device.Product}_${device.DeviceAddress}`);

      const existing = sensors.find((sensor) => sensor.uniqueId === id);
      if (!existing) {
        sensors.push(
          new MqttSensor(client, {
            uniqueId: id,
            deviceClass: "battery",
            discoveryPrefix: "homeassistant",
            context: "bens_imac",
            unitOfMeasurement: "%",
            friendlyName: `${device.Product} battery`,
          })
        );
        return;
      }
      existing.setState(String(device.BatteryPercent));
    });
  }, pushInterval);
};
