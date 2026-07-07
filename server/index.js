import { createApp } from "./app.js";

const port = Number(process.env.PORT || 8787);
createApp().listen(port, () => {
  console.log(`RoboVac Market Intel API listening on http://127.0.0.1:${port}`);
});
