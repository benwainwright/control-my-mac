import { MqttClient } from "mqtt/*";

interface MqttSensorConfig {
  uniqueId: string;
  friendlyName: string;
  discoveryPrefix: string;
  deviceClass: string;
  unitOfMeasurement: string;
  context: string;
}

export class MqttSensor {
  private stateTopic: string;
  constructor(private client: MqttClient, private config: MqttSensorConfig) {
    this.stateTopic = `${this.config.context}/${this.config.uniqueId}/sensor/${this.config.deviceClass}`;
    this.initialise();
  }

  private publish(topic: string, data: Record<string, unknown> | string) {
    const dataString =
      typeof data !== "string" ? JSON.stringify(data, null, 2) : data;
    console.log(`${topic} -> ${dataString}`);
    this.client.publish(topic, dataString);
  }

  public get uniqueId() {
    return this.config.uniqueId;
  }

  private initialise() {
    const homeAssistantStatusTopic = "homeassistant/status";

    this.triggerDiscovery();

    this.client.subscribe(homeAssistantStatusTopic, () => {
      console.log(`Subscribed to ${homeAssistantStatusTopic}`);
    });

    this.client.on("message", (topic, message) => {
      if (
        topic === homeAssistantStatusTopic &&
        message.toString() === "online"
      ) {
        this.triggerDiscovery();
      }
    });
  }

  public triggerDiscovery() {
    const topic = `${this.config.discoveryPrefix}/sensor/${this.config.uniqueId}/config`;

    const discoveryConfig = {
      device_class: this.config.deviceClass,
      state_topic: this.stateTopic,
      unique_id: this.config.uniqueId,
      device: {
        identifiers: [`device_${this.config.uniqueId}`],
        name: this.config.friendlyName,
      },
      unit_of_measurement: this.config.unitOfMeasurement,
      friendly_name: this.config.friendlyName,
    };

    this.publish(topic, discoveryConfig);
  }

  public setState(state: string | number) {
    this.publish(this.stateTopic, String(state));
  }
}
