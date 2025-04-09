import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"

import { useMessage, usePort } from "@plasmohq/messaging/hook"

export const config: PlasmoCSConfig = {
  matches: ["http://localhost:1947/*"]
}

export default function Porter() {
  const port = usePort("mail")
  const [password, setPassword] = useState("")
  const { data } = useMessage<string, string>(async (req, res) => {
    console.log('🚀 -> [ req1 ] ->', req);
    // res.send('123123')
  })
  return (
    <div
      style={{
        position: "fixed",
        padding: "8px",
        right: 0
      }}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={() => {
          port.send({
            password
          })
          setTimeout(() => {
            port.send({
              password
            })
          }, 2000)
        }}>
        Test Password
      </button>
      <p>HELLO {port.data}</p>
    </div>
  )
}
