import {
  getVideoId,
  getTimeStamp,
  getVideoTitle
} from './youtube_util.js';
import { storeHistory } from './history_ui.js';
import { enc } from './config.js';
import { CustomError } from './error.js';

const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
const body = document.body;
const removeBtn = document.querySelector(".remove_button");
const searchBtn = document.querySelector('.search_button');

// 動画を再生 
export async function Play(id, sec = 0) {
  ui("#home");

  video.src = `
    https://www.youtubeeducation.com/embed/${id}?embed_config={"enc":"${enc}"}&start=${sec}
  `;
  console.log('video url: ', video.src);
  video.scrollIntoView({
    behavior: "smooth",
  });

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
    } else {
      throw new CustomError('有効なurl・動画idを入力してください。')
      console.warn("no valid video id provided.");
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