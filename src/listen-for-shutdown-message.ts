import { MqttClient } from "mqtt";
import childProcess from "child_process";
import { promisify } from "util";
const exec = promisify(childProcess.exec);

export const listenForShutdownMessage = (client: MqttClient, topic: string) => {
  client.subscribe(topic, () => {
    client.on("message", async (messageTopic, message) => {
      if (messageTopic === topic) {
        await exec("sudo shutdown -h now");
      }
    });
  });
};
