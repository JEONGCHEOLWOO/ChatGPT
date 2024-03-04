// npm install dotenv - .env 파일 모듈
// .env 파일을 사용하는 이유 -> 오픈소스에 올리면 안되는 중요한 정보( API 키, 포트, DB정보 등)을 외부 파일(.env)에 환경 변수를 정의하여, 보안과 보다 쉬운 유지보수를 하기 위해 사용합니다.
// npm install openai@^4.0.0 - OpenAI 모듈
// npm init - Node.js 모듈

require("dotenv").config(); // dotenv 모듈을 사용하여 .env파일에 정의된 환경 변수 로드
const OpenAI = require("openai"); // OpenAI모듈을 불러옴

function chat(question) {
  return (
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST", // POST 메소드 방식으로 body 정보를 위에 API에 보냄
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // OpenAI API 키를 사용하여 인증
        "Content-Type": "application/json", // JSON형태의 Content type
      },
      body: JSON.stringify({
        // JSON형태로 데이터를 전송
        model: "gpt-3.5-turbo", // 사용 모델
        messages: [{ role: "user", content: question }], // 사용자가 입력한 질문을 메세지로 포함해서 전송
      }),
    })
      .then((res) => res.json()) // 응답을 JSON 형식으로 파싱
      // .then((data) => console.log(data))
      // .then((data) => data.choices[0].message.content)  -> 처음에 이걸로 했을 때 message를 [Object]와 같은 형태로 반환했지만, 변수에 담아서 반환을 하면 실제 데이터를 줌.
      // 직접 받은 경우에는 데이터가 객체로 반환되어 toString() 메서드가 호출되어 [object Object]와 같이 출력됩니다. 하지만 변수에 해당 내용을 담고 반환하면, 해당 변수에는 객체가 아닌 실제 데이터가 담겨 있기 때문에 정상적으로 응답이 출력됩니다.
      .then((data) => {
        // 파싱된 JSON 데이터(응답에서 챗봇의 메세지를 변수에 할당하여 반환)를 처리
        const messageContent = data.choices[0].message.content;
        return messageContent;
      })
  );
}

const readline = require("readline"); // Node.js의 readline 모듈을 사용하여 터미널 입력을 처리
const rl = readline.createInterface({
  input: process.stdin, // 터미널 입력 스트림을 사용하여 입력 처리
  output: process.stdout, // 터미널 출력 스트림을 사용하여 출력 처리
});

console.log("💬 ChatGPT 터미널 챗앱 💬\n");
rl.prompt(); // 입력 대기

rl.on("line", (question) => {
  // 질문 할 때마다 이벤트 리스너 등록
  chat(question).then((answer) => {
    // chat 함수를 호출하여 응답을 받음
    console.log(`🤖 ${answer}\n`);
    rl.prompt(); // 다시 입력 대기 상태로 전환
  });
});
