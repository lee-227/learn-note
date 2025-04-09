import { usePort } from "@plasmohq/messaging/hook"

type RequestBody = {
  hello: string
}

type ResponseBody = string

function DeltaTab() {
  const mailPort = usePort<RequestBody, ResponseBody>("mail")

  return (
    <div>
      {mailPort.data}
      <button
        onClick={async () => {
          console.log('🚀 -> [ req ] ->', mailPort);
          mailPort.send({
            hello: "world"
          })
        }}>
        Send Port123
      </button>
    </div>
  )
}

export default DeltaTab
