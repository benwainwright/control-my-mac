import { DeviceBatteryLevel } from "./battery-level.js";

export interface System {
  getBluetoothDevicesBatteryLevels: () => Promise<DeviceBatteryLevel[]>
  shutdown: () => Promise<void>
  turnoffScreen: () => Promise<void>
}
