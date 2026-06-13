import { useState, useRef } from 'react'

function App() {

const [status, setStatus] = useState("尚未開始")
const [transcript, setTranscript] = useState("")
const [aiReply, setAiReply] = useState("")

const mediaRecorderRef = useRef(null)
const audioChunksRef = useRef([])

const lastReplyRef = useRef("")

function handleAIResponse(text) {

let reply = ""

if (text.includes("你好")) {
  reply = "你好，我是 AI 助教！"
}

else if (
  text.includes("不會") ||
  text.includes("看不懂")
) {
  reply = "需要我幫你解釋嗎？"
}

else if (
  text.includes("for loop")
) {
  reply = "for loop 是用來重複執行程式的迴圈。"
}

if (
  reply !== "" &&
  reply !== lastReplyRef.current
) {

  setAiReply(reply)

  lastReplyRef.current = reply

}

}

async function startRecording() {

try {

  const stream =
    await navigator.mediaDevices.getUserMedia({
      audio: true
    })

  const mediaRecorder =
    new MediaRecorder(stream)

  mediaRecorderRef.current =
    mediaRecorder

  audioChunksRef.current = []

  mediaRecorder.ondataavailable =
    (event) => {

      audioChunksRef.current.push(
        event.data
      )

    }

  mediaRecorder.start()

  setStatus("錄音中...")

  console.log("開始錄音")

}

catch (err) {

  console.error(err)

  setStatus("無法取得麥克風")

}

}

function stopRecording() {

const recorder =
  mediaRecorderRef.current

if (!recorder) return

recorder.onstop = () => {

  const audioBlob =
    new Blob(
      audioChunksRef.current,
      {
        type: "audio/webm"
      }
    )

  console.log(
    "錄音完成",
    audioBlob
  )

  console.log(
    "size:",
    audioBlob.size
  )

  setStatus(
    "錄音完成"
  )

  setTranscript(
    `錄音大小: ${audioBlob.size} bytes`
  )

}

recorder.stop()

}

return (

<div
  style={{
    padding: "20px"
  }}
>

  <h1>
    AI Assistant Panel
  </h1>

  <button
    onClick={
      startRecording
    }
  >
    開始錄音
  </button>

  <button
    onClick={
      stopRecording
    }
    style={{
      marginLeft: "10px"
    }}
  >
    停止錄音
  </button>

  <p>
    {status}
  </p>

  <h2>
    測試結果：
  </h2>

  <p>
    {transcript}
  </p>

  <h2>
    AI 回應：
  </h2>

  <p>
    {aiReply}
  </p>

</div>

)

}

export default App