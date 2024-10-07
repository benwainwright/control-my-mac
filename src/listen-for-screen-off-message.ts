
import childProcess from "child_process";
import { promisify } from "util";
import { MqttConnection } from "./mqtt-connection.js";

const exec = promisify(childProcess.exec);

export const listenForScreenOffMessage = (
  client: MqttConnection,
  topic: string
) => {
  client.subscribe(topic, async () => {
    await exec("pmset displaysleepnow");
  });
};
