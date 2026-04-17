import { MacSequoiaSystem } from "./systems/mac-sequoia.js";
import { System } from "./types/system.js";

export const getSystem = (): System => {
  return new MacSequoiaSystem()
}
