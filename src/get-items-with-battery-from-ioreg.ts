import { execa } from "execa";
import plist from "plist";

export const getItemsWithBatteryFromIoreg = async () => {
  const result = await execa("ioreg", [
    "-r",
    "-l",
    "-a",
    "-k",
    "BatteryPercent",
  ]);
  return plist.parse(result.stdout) as Record<
    string,
    string | number | boolean | Buffer
  >[];
};
