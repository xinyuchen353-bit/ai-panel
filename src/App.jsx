import { useState, useRef } from 'react'

function App() {

  console.log(
  "iframe?",
  window.self !== window.top
)
const [status, setStatus] = useState("尚未開始")
const [transcript, setTranscript] = useState("")
const [aiReply, setAiReply] = useState("")

const recognitionRef = useRef(null)
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

function startSpeechRecognition() {

if (recognitionRef.current) return

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition

if (!SpeechRecognition) {

  setStatus("你的瀏覽器不支援語音辨識")

  return

}

const recognition =
  new SpeechRecognition()

recognitionRef.current =
  recognition

recognition.lang =
  "zh-TW"

recognition.continuous =
  true

recognition.interimResults =
  true

recognition.onstart =
  () => {

    setStatus(
      "正在聆聽..."
    )

  }

recognition.onresult =
  (event) => {

    const latestResult =
      event.results[
        event.results.length - 1
      ][0].transcript

    console.log(
      latestResult
    )

    setTranscript(
      latestResult
    )

    handleAIResponse(
      latestResult
    )

  }

recognition.onerror =
  (event) => {

    console.error(
      event
    )

    setStatus(
      "語音辨識錯誤"
    )

  }

recognition.onend =
  () => {

    recognitionRef.current =
      null

    setStatus(
      "語音辨識已停止"
    )

  }

recognition.start()

}

function stopSpeechRecognition() {

if (
  recognitionRef.current
) {

  recognitionRef.current.stop()

  recognitionRef.current =
    null

  setStatus(
    "已手動停止"
  )

}

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
      startSpeechRecognition
    }
  >
    開始語音辨識
  </button>

  <button
    onClick={
      stopSpeechRecognition
    }
    style={{
      marginLeft: "10px"
    }}
  >
    停止語音辨識
  </button>

  <p>
    {status}
  </p>

  <h2>
    你說的話：
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