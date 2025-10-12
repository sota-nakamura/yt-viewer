
/*
let message = document.querySelector(".message");
let btn = document.querySelector(".btn");
let timeStamp = Date.now()
let attempts = 0;
let messages = [
  "本当にYoutubeを見るのですか？それは将来本当に後悔しない行為ですか？",
  "Youtubeを見るのですか？今日やるべきタスクは完了している、もしくは完了の目処が立っていますか？",
  "今ここで動画の視聴に時間を使うことで、将来に影響があるかもしれません。本当に続けますか？",
  "一日に動画視聴に使う時間を考えて使用していますか？",
  "休憩時間にのみ使用し、それ以外の時間とメリハリをつけていますか？",
  "集中が散漫になったからと言って、動画視聴に時間を使おうとしていませんか？",
];
function randomMessage() {
  let a = messages.length;

  while (a) {
    let j = Math.floor(Math.random() * a);
    let t = messages[--a];
    messages[a] = messages[j];
    messages[j] = t;
  }
  return messages.shift();
}
document.addEventListener("DOMContentLoaded", async () => {
  message.innerText = randomMessage();
  btn.disabled = true;
  await ui("#dialog");
  setTimeout(() => {
    btn.disabled = false;
  }, 5000);
  setInterval(() => {
    let time = Data.now();
    let timeDiff = time - timeStamp;
    if(timeDiff >= 60 * 60 * 1000) {
      message = "YouTubeの視聴を続けますか？"
      ui("#dialog");
      setTimeout(() => {
        btn.disabled = false;
      }, 5000);
    }
  }, 1000);
});
function closeDialog() {
  ui("#dialog");
  btn.disabled = true;
  message.innerText = randomMessage();
  if (attempts != 5) {
    ui("#dialog");
    attempts++;
  }
  setTimeout(() => {
    btn.disabled = false;
  }, 5000);
}
function cancel() {
  location.href = "https://loilonote.app";
}
*/