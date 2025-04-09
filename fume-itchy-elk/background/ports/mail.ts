import type { PlasmoMessaging } from "@plasmohq/messaging"

const SECRET = "LABARRE"

const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  const { password } = req.body
  console.log('🚀 -> [ LABARRE ] ->', req);
  if (password !== SECRET) {
    res.send("(HINT: HOMETOWN)")
  } else {
    res.send("CAPTAIN")
  }
  setTimeout(() => {
    res.send("CAPTAIN123")
  }, 3000)
}

export default handler
