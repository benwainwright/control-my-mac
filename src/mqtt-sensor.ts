import { Mqtt } from "./mqtt.js";

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

  constructor(private client: Mqtt, private config: MqttSensorConfig) {
    this.stateTopic = `${this.config.context}/${this.config.uniqueId}/sensor/${this.config.deviceClass}`;
    this.initialise();
  }

  public get uniqueId() {
    return this.config.uniqueId;
  }

  private initialise() {
    const homeAssistantStatusTopic = "homeassistant/status";

    this.triggerDiscovery();

    this.client.subscribe(homeAssistantStatusTopic, (message) => {
      if (message === "online") {
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

    this.client.publish(topic, discoveryConfig);
  }

  public setState(state: string | number) {
    this.client.publish(this.stateTopic, String(state));
  }
}
