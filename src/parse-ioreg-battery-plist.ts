import plist from "plist";

type IoregBatteryItem = Record<string, string | number | boolean | Buffer>;

export const parseIoregBatteryPlist = (stdout: string): IoregBatteryItem[] => {
  const trimmedStdout = stdout.trim();

  if (!trimmedStdout) {
    return [];
  }

  const parsed = plist.parse(trimmedStdout);

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed as IoregBatteryItem[];
};
