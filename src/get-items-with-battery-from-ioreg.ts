import { execa } from "execa";

import { parseIoregBatteryPlist } from "./parse-ioreg-battery-plist.js";

export const getItemsWithBatteryFromIoreg = async () => {
  const result = await execa("ioreg", [
    "-r",
    "-l",
    "-a",
    "-k",
    "BatteryPercent",
  ]);
  return parseIoregBatteryPlist(result.stdout);
};
