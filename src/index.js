import { splashScreen } from "./pages/splash";
import { chooseScreen } from "./pages/choose";
import { analyzeScreen } from "./pages/analyze";
import * as elements from "./services/elements";
require("./index.css");

for (const e of Object.keys(elements)) {
  if (e !== "hide" && e !== "show") {
    elements.hide(elements[e]);
  }
}

async function run() {
  let next = "splash";
  let item = null;
  while (next !== "end") {
    switch (next) {
      case "splash":
        await splashScreen();
        next = "choose";
        break;

      case "choose":
        item = await chooseScreen();
        next = item ? "analyze" : "splash";
        break;

      case "analyze":
          await analyzeScreen(item);
          next = 'choose';
          break;

      default:
        console.error(`Unknown screen ${next}`);
        break;
    }
  }
}

run().then(() => console.log("ok"));
