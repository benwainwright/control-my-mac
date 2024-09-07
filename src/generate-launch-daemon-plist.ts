import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const name = `com.benwainwright.control-mac`;
const jsFile = join(__dirname, "..", "dist", "run.js");

const username = process.env["HASS_USERNAME"];
const password = process.env["HASS_PASSWORD"];

if (!username || !password) {
  throw new Error("Credentials missing");
}
console.log(`
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN"
    "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict> 
      <key>Label</key>
      <string>${name}</string>
      <key>ProgramArguments</key>
      <array>
          <string>${process.execPath}</string>
          <string>${jsFile}</string>
      </array>
      <key>EnvironmentVariables</key>
      <dict>
        <key>HASS_USERNAME</key>
        <string>${username}</string>
        <key>HASS_PASSWORD</key>
        <string>${password}</string>
      </dict>

      <key>KeepAlive</key>
      <true />
      <key>RunAtLoad</key>
      <true />

      <key>StandardOutPath</key>
      <string>/tmp/${name}.out.log</string> 
      <key>StandardErrorPath</key>
      <string>/tmp/${name}.error.log</string> 
  </dict> 
</plist>`);
