import { execa } from "execa";
import childProcess from "child_process";
import { promisify } from "node:util";

import { parseIoregBatteryPlist } from "../parse-ioreg-battery-plist.js";
import { System } from "../types/system.js";

const exec = promisify(childProcess.exec);

export class MacSequoiaSystem implements System {

  public async turnoffScreen() {
    await exec("pmset displaysleepnow");
  }

  public async shutdown() {
    await exec("sudo shutdown -h now");
  }

  public async getBluetoothDevicesBatteryLevels() {
    const result = await execa("ioreg", [
      "-r",
      "-l",
      "-a",
      "-k",
      "BatteryPercent",
    ]);

    const batteryPlist = parseIoregBatteryPlist(result.stdout);

    return batteryPlist.map(item => ({
      deviceId: `§${item.Product}_${item.DeviceAddress}`,
      deviceName: `${item.Product} battery`,
      percent: Number.parseInt(String(item.BatteryPercent), 10)
    }))
  }
}
