import mqtt, { IClientOptions, MqttClient } from "mqtt";

export class MqttConnection {
  private _client: MqttClient | undefined;

  public constructor(private options: IClientOptions) {}

  private get client(): MqttClient {
    if (!this._client) {
      this._client = mqtt.connect(this.options);

      this.client.on("error", (message) => {
        console.log(message);
      });
    }
    return this._client;
  }

  private initialise() {
    return new Promise<void>((accept) => {
      if (this._client) {
        return accept();
      } else {
        this.client.on("connect", () => {
          accept();
        });
      }
    });
  }

  public async connect(): Promise<void> {
    await this.initialise();
  }

  public publish(topic: string, data: Record<string, unknown> | string) {
    const dataString =
      typeof data !== "string" ? JSON.stringify(data, null, 2) : data;
    console.log(`${topic} -> ${dataString}`);
    this.client.publish(topic, dataString);
  }

  public subscribe(topic: string, handler: (message: string) => void) {
    this.client.subscribe(topic, () => {
      console.log(`Successfully subscribed to ${topic}`);
      this.client.on("message", async (messageTopic, message) => {
        if (messageTopic === topic) {
          handler(message.toString());
        }
      });
    });
  }
}
