import {
  getVideoId,
  getTimeStamp,
  getVideoTitle
} from './youtube_util.js';
import {
  getHistoryState,
  createHistoryListHTML,
  storeHistory
} from './history_ui.js';
import {
  initializePlaybackOnLoad
} from './playback.js';

const urlInput = document.querySelector('input[name="url"]');
const video = document.querySelector(".iframe");
const playbackFeatureToggler = document.querySelector(".usePlayback");

// 動画を再生 
export async function Play(id, sec = 0) {
  ui("#home");

  video.src = `
  https://www.youtube.com/embed/${id}?autoplay=1&start=${sec || 0}
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
      console.warn("no valid video id provided.");
    }
  }
}

window.Play = Play;
window.getYoutube = getYoutube;