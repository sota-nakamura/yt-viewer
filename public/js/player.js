import {
  getVideoId,
  getTimeStamp
} from './youtube_util.js';
import { storeHistory } from './history_ui.js';
import { enc } from './config.js';

const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
const body = document.body;
const removeBtn = document.querySelector(".remove_button");
const searchBtn = document.querySelector('.search_button');

// 動画を再生 
export async function Play(id, sec = 0) {
  ui("#home");

  video.src = `https://www.youtubeeducation.com/embed/${id}?embed_config={"enc":"${enc}"}&start=${sec}&enablejsapi=1`;
}

// URLをinputから取得し、再生を開始
export async function getYoutube(url) {
  urlInput.blur();

  if (url) {
    const id = getVideoId(url);
    const timeStamp = getTimeStamp(url);
    if (id) {
      await Play(id, timeStamp);
    }
  }
}

window.Play = Play;
window.getYoutube = getYoutube;

body.addEventListener('keyup', (e) => {
  if(e.code === 'Slash') {
    urlInput.focus();
  }
});

removeBtn.addEventListener('click', () => {
  urlInput.value = '';
  urlInput.focus();
});

searchBtn.addEventListener('click', () => {
  getYoutube(urlInput.value)
});

urlInput.addEventListener("input", (e) => {
  if (e.target.value) {
    removeBtn.style.display = "inline-flex";
  } else {
    removeBtn.style.display = "none";
  }
});

urlInput.addEventListener("keyup", (event) => {
  if (event.code === "Enter") {
    event.preventDefault();
    getYoutube(urlInput.value);
  }
});

video.onload = () => {
  console.log('successfully loaded youtube player.')
  video.scrollIntoView({
    behavior: "smooth",
  });
  console.log('video url: ', video.src);
  video.contentWindow.postMessage('{"event": "listening"}', '*');
}
window.addEventListener('message', (event) => {
  let data = event.data;
  if(typeof event.data === "string") {
    data = JSON.parse(event.data)
  } else {
    data = JSON.stringify(event.data).replace(/\\/g, "");
  }
  console.log('event:', data.event);
  console.log("playerState:", data.info.playerState);
  console.log('currentTime:', data.info?.currentTime);
  if(data.event !== "initialDelivery" && data.info.playerState) {
    storeHistory({
      'title': data.info?.videoData.title,
      'id': data.info?.videoData.video_id,
      'time': Math.floor(data.info?.currentTime) || 0
    }, [0, 2, 5].includes(data.info?.playerState));
  }
  // video.contentWindow.postMessage('{"event": "listening"}', '*');
});