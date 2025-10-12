import {
  getVideoId,
  getTimeStamp,
  getVideoTitle
} from './youtube_util.js';
import { storeHistory } from './history_ui.js';
import { updateTime } from './playback.js';
import { enc } from './config.js';
import YouTubeIFrameCtrl from 'https://cdn.jsdelivr.net/npm/youtube-iframe-ctrl@1.0.3/+esm'

const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
const body = document.body;
const removeBtn = document.querySelector(".remove_button");
const searchBtn = document.querySelector('.search_button');
let player = '';

// 動画を再生 
export async function Play(id, sec = 0) {
  ui("#home");

  video.src = `
    https://www.youtubeeducation.com/embed/${id}?embed_config={"enc":"${enc}"}&start=${sec}
  `;
  console.log('video url: ', video.src);
  storeHistory({
    title: await getVideoTitle(id),
    id: id,
    time: sec || 0
  });
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
  player = new YouTubeIFrameCtrl(video);
  console.log('successfully loaded youtube player.')
  video.scrollIntoView({
    behavior: "smooth",
  });
}

video.addEventListener('ytmessage', (event) => {
  const time = event.detail.info.currentTime;
  if(event.detail.event === "infoDelivery" && typeof time === 'number') {
    console.log('currentTime:', time);
    updateTime(Math.floor(time));
  }
});