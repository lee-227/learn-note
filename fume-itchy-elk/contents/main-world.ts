import type { PlasmoCSConfig } from "plasmo"

import { sendToBackgroundViaRelay } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start",
  world: "MAIN"
}
window.relay = {
  description: "Message from content script in main world",
  tryRelay: async () => {
    console.log('🚀 -> [ open-extension ] ->', 11111111);
    let result = await sendToBackgroundViaRelay({
      name: "open-extension"
    })
    return result
  }
}
