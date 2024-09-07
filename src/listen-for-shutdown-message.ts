import childProcess from "child_process";
import { promisify } from "util";
import { Mqtt } from "./mqtt.js";

const exec = promisify(childProcess.exec);

export const listenForShutdownMessage = (client: Mqtt, topic: string) => {
  client.subscribe(topic, async () => {
    await exec("sudo shutdown -h now");
  });
};
