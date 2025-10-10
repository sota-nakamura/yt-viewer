const loader = document.querySelector(".loading");
window.addEventListener("load", async () => {
  loader.classList.add("hidden");
});
/*
const message = document.querySelector(".message");
const btn = document.querySelector(".btn");
const timeStamp = Date.now()
const attempts = 0;
const messages = [
  "本当にYoutubeを見るのですか？それは将来本当に後悔しない行為ですか？",
  "Youtubeを見るのですか？今日やるべきタスクは完了している、もしくは完了の目処が立っていますか？",
  "今ここで動画の視聴に時間を使うことで、将来に影響があるかもしれません。本当に続けますか？",
  "一日に動画視聴に使う時間を考えて使用していますか？",
  "休憩時間にのみ使用し、それ以外の時間とメリハリをつけていますか？",
  "集中が散漫になったからと言って、動画視聴に時間を使おうとしていませんか？",
];
function randomMessage() {
  const a = messages.length;

  while (a) {
    const j = Math.floor(Math.random() * a);
    const t = messages[--a];
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
    const time = Data.now();
    const timeDiff = time - timeStamp;
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