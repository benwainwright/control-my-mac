import { execa } from "execa";
import plist from "plist";

export const getItemsWithBatteryFromIoreg = async () => {
  const result = await execa("ioreg", [
    "-l",
    "-a",
    "-k",
    "-c",
    "IOHIDSystem"])

  console.log('done')

  console.log(plist.parse(result.stdout) as Record<
    string,
    string | number | boolean | Buffer
  >);
};

getItemsWithBatteryFromIoreg()
